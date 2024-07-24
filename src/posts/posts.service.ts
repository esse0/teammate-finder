import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService,){}

  async create(login:string, createPostDto: {file: Express.Multer.File | undefined, message: string | undefined}) {
    let user = await this.prisma.user.findUnique({where: {login: login}});
    
    if(!user) {
      throw new ForbiddenException('User not found');
    }
    
    if(!createPostDto.file && !createPostDto.message) {
      throw new ForbiddenException('Bad post params!');
    }

    let post = await this.prisma.posts.create({
      data:{
        image: null,
        description: createPostDto.message,
        userId: user.id
      }
    });

    let filePath = "";
    let fileExtName = "";

    if(createPostDto.file){
      const userDir = join('..', 'teammate-finder/client/posts', login);

      if (!existsSync(userDir)) {
        mkdirSync(userDir, { recursive: true });
      }

      // Определите имя файла
      fileExtName = extname(createPostDto.file.originalname);
      filePath = join(userDir, `${post.id}${fileExtName}`);

      // Запишите файл на диск
      writeFileSync(filePath, createPostDto.file.buffer);

      if(!existsSync(filePath)) throw new ForbiddenException('File cant upload!');
    }
    
    await this.prisma.posts.update({where:{id: post.id}, data:{
      image: `https://localhost:3000/posts/${user.login}/${post.id}${fileExtName}`
    }});

    await this.prisma.user.update({where:{id:user.id}, data:{
      posts:{
        connect:{
          id: post.id
        }
      }
    }});

    return "Success";
  }

  async findAll(login: string) {
    let user = await this.prisma.user.findUnique({where: {login: login}});
    
    if(!user) {
      throw new ForbiddenException('User not found');
    }

    let posts = await this.prisma.posts.findMany({include:{
      usersLikes: true,
      user: true
    }});

    posts.forEach(el => {
      let isLiked = false;
      
      el.usersLikes.forEach(element => {
        if(element.userLogin == user.login) isLiked = true;
      });

      let count = el.usersLikes.length;
      let login = el.user.login;

      delete el.usersLikes;
      delete el.user;

      (el as any).likesCount = count;
      (el as any).userName = login;
      (el as any).isLiked = isLiked;
    })

    return {message: "success", posts: posts};
  }

  async findFavorites(login: string) {
    let user = await this.prisma.user.findUnique({where: {login: login}});
    
    if(!user) {
      throw new ForbiddenException('User not found');
    }

    let posts = await this.prisma.posts.findMany({where:{usersLikes:{some:{userLogin: user.login}}}, include:{
      usersLikes: true,
      user: true
    }});

    posts.forEach(el => {
      let isLiked = false;
      
      el.usersLikes.forEach(element => {
        if(element.userLogin == user.login) isLiked = true;
      });

      let count = el.usersLikes.length;
      let login = el.user.login;

      delete el.usersLikes;
      delete el.user;

      (el as any).likesCount = count;
      (el as any).userName = login;
      (el as any).isLiked = isLiked;
    })
    
    return {message: "success", posts: posts};
  }

  async findByUser(urlogin:string, login: string) {
    let your = await this.prisma.user.findUnique({where: {login: urlogin}})
    let user = await this.prisma.user.findUnique({where: {login: login}});
    
    if(!user || !your) {
      throw new ForbiddenException('User not found');
    }

    let posts = await this.prisma.posts.findMany({where:{userId: user.id}, include:{
      usersLikes: true,
      user: true
    }});

    posts.forEach(el => {
      let isLiked = false;
      
      el.usersLikes.forEach(element => {
        if(element.userLogin == your.login) isLiked = true;
      });

      let count = el.usersLikes.length;
      let login = el.user.login;

      delete el.usersLikes;
      delete el.user;

      (el as any).likesCount = count;
      (el as any).userName = login;
      (el as any).isLiked = isLiked;
    })
    
    return {message: "success", posts: posts};
  }

  async setLike(postId: number, login:string, isLiked: boolean){

    let user = await this.prisma.user.findUnique({where: {login: login}});
    
    if(!user) {
      throw new ForbiddenException('User not found');
    }

    let post = await this.prisma.posts.findUnique({where: {id: postId}});
    
    if(!post) {
      throw new ForbiddenException('Post not found');
    }

    let glikedPosts = await this.prisma.likedPostsOnUsers.findUnique({where:{
      userLogin_postId: {
        userLogin: user.login,
        postId: post.id
      }
    }});

    if(!isLiked){
      if(glikedPosts) throw new ForbiddenException('Post liked!');


      let likedPosts = await this.prisma.likedPostsOnUsers.create({data:{
        userLogin: user.login,
        postId: post.id
      }});
      
      await this.prisma.user.update({where:{id: user.id}, data:{
        likedPosts:{
          connect:{
            userLogin_postId: likedPosts
          }
        }
      }});

    }else {
      if(!glikedPosts) throw new ForbiddenException('Post is not liked!');
  
      await this.prisma.likedPostsOnUsers.delete({where: {userLogin_postId:{
        postId: post.id,
        userLogin: user.login
      }}});
    }
    
    return {message:"success"};
  }

  async remove(login: string, postId: number | null) {
    let user = await this.prisma.user.findUnique({where: {login: login}});
    
    if(!user || !postId) {
      throw new ForbiddenException('User not found');
    }

    let post = await this.prisma.posts.findUnique({where:{id:postId}});

    if(!post) {
      throw new ForbiddenException('Post not found');
    }

    await this.prisma.likedPostsOnUsers.deleteMany({where: {postId: postId}});

    return this.prisma.posts.delete({where:{id: postId}});
  }
}
