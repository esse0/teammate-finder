import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChats(userLogin:string){
    let user = await this.prisma.user.findUnique({where:{login: userLogin}, include: {chatrooms: true}})

    if(!user) throw new BadRequestException('User not found');

    user.chatrooms.forEach(el => {
      let temp = "";

      if(el.flogin != user.login){
        temp = el.flogin
      }else if(el.slogin != user.login){
        temp = el.slogin;
      }

      delete el.flogin;
      delete el.slogin;

      (el as any).login = temp
    })

    return user.chatrooms;
  }

  async getMessages(chatId:number){
    let chat = await this.prisma.chatroom.findUnique({where:{id: chatId}, include:{messages: true}})

    if(!chat) throw new BadRequestException('chat not found');

    chat.messages.forEach(element => {
      let temp = element.created_at.toDateString();
      delete element.created_at;

      (element as any).created_at = temp;
    });

    return chat.messages;
  }

  async sendMessage(fromLogin: string, chatId: number, body: string){
    let chat = await this.prisma.chatroom.findUnique({where:{id: chatId}, include:{messages:true}})
    
    if(!chat) throw new BadRequestException('chat not found');

    let user = await this.prisma.user.findUnique({where: { login: fromLogin}});
    if(!user) throw new  BadRequestException('user not found');

    let message = await this.prisma.messages.create({data:{
      sender_id: user.id,
      body: body,
      chatroom_id: chat.id
    }})

    await this.prisma.user.update({where:{ id: user.id}, data:{
      massages:{
        connect:{
          id: message.id
        }
      }
    }})

    await this.prisma.chatroom.update({where:{ id: chat.id}, data:{
      messages:{
        connect:{
          id: message.id
        }
      }
    }})
    return "success";
  }
}
