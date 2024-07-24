import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateInfoDto } from './dto/UpdateInfo.dto';
import { UpdatePasswordDto } from './dto/Update-password.dto';
import { UpdateEmailDto } from './dto/Update-email.dto';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,){}

  async subscribeToUser(userLogin: string, friendLogin: string){
    let user = await this.prisma.user.findUnique({where: {login: userLogin}});
    
    if(!user) {
      throw new ForbiddenException('User not found');
    }
    
    let friend = await this.prisma.user.findUnique({where: {login: friendLogin}, include: { followedBy:true}});

    if(!friend)
    {
        throw new BadRequestException('Friend not found');
    }
    
    friend.followedBy.forEach(el => {
      if(el.id == user.id) throw new BadRequestException('you are already subscribed');
    })

    let changedUser = await this.prisma.user.update({where: {id: user.id}, data:{
      following: {
        connect:{
          id: friend.id
        }
      }
    }});

    let changedFriend = await this.prisma.user.update({ where:{ id: friend.id }, data:{
      followedBy: {
        connect: {
          id: user.id
        }
      }
    }});

    return (changedFriend != null && changedUser != null);
  }

  async unsubscribeFromUser(userLogin: string, friendLogin: string){
    let user = await this.prisma.user.findUnique({where: {login: userLogin}});
    
    if(!user) {
      throw new ForbiddenException('User not found');
    }
    
    let friend = await this.prisma.user.findUnique({where: {login: friendLogin}});

    if(!friend)
    {
        throw new BadRequestException('Friend not found');
    }

    let changedUser = await this.prisma.user.update({where: {id: user.id}, data:{
      following: {
        disconnect: {
          id: friend.id
        }
      }
    }});

    let changedFriend = await this.prisma.user.update({where: {id: friend.id}, data:{
      followedBy: {
        disconnect: {
          id: user.id
        }
      }
    }});

    return (changedFriend != null && changedUser != null);
  }

  async  createChat(userLogin: string, friendLogin: string) {
    let user = await this.prisma.user.findUnique({where: {login:userLogin}, include: {chatrooms: true}});
    let friend = await this.prisma.user.findUnique({where: {login: friendLogin}, include: {chatrooms:true}});

    if(!user || !friend) throw new BadRequestException('User not found');

    user.chatrooms.forEach(el => {
      friend.chatrooms.forEach(elem => {
        if(el.id == elem.id) throw new BadRequestException('Chat already exists');
      })
    })
    
    let chatroom = await this.prisma.chatroom.create({data: { slogin: user.login, flogin: friend.login, chatroom_users: { connect: [{id: user.id},
      {id: friend.id}]}}});

    await await this.prisma.user.update({where: {id: user.id}, data:{
      chatrooms:{
        connect:{
          id: chatroom.id
        }
      }
    }});

    await await this.prisma.user.update({where: {id: friend.id}, data:{
      chatrooms:{
        connect:{
          id: chatroom.id
        }
      }
    }});
    
    return "success";
  }

  async findAll(userLogin: string) {
    let user = await this.prisma.user.findUnique({where: {login:userLogin}});
    let users = await this.prisma.user.findMany({include: {followedBy:true, games:true}});

    users.forEach(el => {
        delete el.password;
        delete el.hashedRefreshToken;
        delete el.id;


        el.followedBy.forEach(element =>{
          if(element.id == user.id){
            (el as any).friend = true;
          }else{
            (el as any).friend = false;
          }
        })
        
    });

    users = users.filter((el) => el.login !== userLogin);

    users.forEach(el => {
      delete el.followedBy;
    })

    return users;
  }

  async findOne(loginP: string) {
    let user = await this.prisma.user.findUnique({where: {login: loginP}})
    return {"img":"", "login":user.login, "email":user.email, "bio": user.bio, "first_name": user.first_name, "last_name": user.last_name, "patronymic":user.patronymic, "steamId": user.steamId};
  }

  async findFollowing(loginP: string) {
    let user = await this.prisma.user.findUnique({ where: {login: loginP}, include:{
      following: true
    }});
    
    if(!user) {
      throw new ForbiddenException('User not found');
    }

    user.following.forEach(el => {
      delete el.id;
      delete el.hashedRefreshToken;
      delete el.password;
    })

    return user.following;
  }

  async findFollowed(loginP: string) {
    let user = await this.prisma.user.findUnique({where: {login: loginP}, include:{
      followedBy: true
    }});

    if(!user) {
      throw new ForbiddenException('User not found');
    }

    user.followedBy.forEach(el => {
      delete el.id;
      delete el.hashedRefreshToken;
      delete el.password;
    })
    
    return user.followedBy;
  }

  async updateInfo(id: string, updateDto: UpdateInfoDto) {
    let user = await this.prisma.user.findUnique({where: {id: id}});

    if(!user) {
      throw new ForbiddenException('User not found');
    }

    return await this.prisma.user.update({where:{id: id}, data:{
      bio: updateDto.bio,
      first_name: updateDto.firstName,
      last_name: updateDto.lastName,
      patronymic: updateDto.patronymic
    }});
  }

  async updatePassword(id: string, updateDto: UpdatePasswordDto) {
    let user = await this.prisma.user.findUnique({where: {id: id}});

    if(!user) {
      throw new ForbiddenException('User not found');
    }
    
    const passwordMatches = await bcrypt.compare(updateDto.OldPassword, user.password)
    
    if(!passwordMatches) {
      throw new BadRequestException('Old password wrong');
    }

    let hashPassword = await this.getHash(updateDto.NewPassword);

    return await this.prisma.user.update({where:{id: id}, data:{
      password: hashPassword
    }});
  }

  async updateEmail(id: string, updateDto: UpdateEmailDto) {
    let user = await this.prisma.user.findUnique({where: {id: id}});

    if(!user) {
      throw new ForbiddenException('User not found');
    }

    let userEmail = await this.prisma.user.findUnique({where: {email: updateDto.email}});

    if(userEmail) throw new BadRequestException('Email already exist');

    return await this.prisma.user.update({where:{id: id}, data:{
      email: updateDto.email
    }});
  }

  async getGames(login:string){
    let user = await this.prisma.user.findUnique({where: {login: login}});

    if(!user) {
      throw new ForbiddenException('User not found');
    }

    if(user.steamId == null){
      return {message:"steam not linked", games:[]};
    }

    let gamesOnUser = await this.prisma.gamesOnUsers.findMany({where:{userId:user.id}, include:{game:true}});
    let games = []

    gamesOnUser.forEach(el =>{
      games.push(el.game);
    })

    return {message:"success", games: games}
  }

  async updateSteamLink(id: string, steamId: number | null) {
    if(steamId == null){
      await this.prisma.user.update({where:{id: id}, data:{
        steamId: null
      }});

      throw new ForbiddenException('Bad steam id');
    }

    if(steamId.toString().length < 10) throw new ForbiddenException('Bad steam id');
    
    let user = await this.prisma.user.findUnique({where: {id: id}});

    if(!user) {
      throw new ForbiddenException('User not found');
    }
   
    let userSteam = await this.prisma.user.findUnique({where: {steamId: steamId.toString()}});

    if(userSteam) throw new BadRequestException('Steam already connected');

    await this.prisma.gamesOnUsers.deleteMany({where:{userId: user.id}});

    await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=86A4688F538FBAC2314CCA73B9CD05CA&steamid=${steamId}&format=json`).then((el) => {
      if(!el.data.response || !el.data.response.games) throw new ForbiddenException('Account is private!');

      el.data.response.games.forEach(async el => {
        if(el){
          let game = this.prisma.games.findUnique({where:{id:el.appid}});
          if(game){
            try{
              let gameOnUser = await this.prisma.gamesOnUsers.create({data: {
                userId: user.id,
                gameId: el.appid
              }});
              await this.prisma.user.update({where:{id: id}, data:{games: {connect: {userId_gameId: gameOnUser}}} });
            }catch{

            }
          }
        }
      })
    }).catch(ex => {
      throw new ForbiddenException('Bad steam Id!');
    })
    
    return await this.prisma.user.update({where:{id: id}, data:{
      steamId: steamId.toString()
    }});;
  }

  async remove(id: string) {
    return await this.prisma.user.delete({where: {id: id}});
  }

  async getHash(data: string){
    const saltOrRounds = 10;

    const hashedData = await bcrypt.hash(data, saltOrRounds);

    return hashedData;
  }
}
