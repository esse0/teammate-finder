import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Res, UseInterceptors, UploadedFile, UploadedFiles, BadRequestException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AtGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/RoleDecorator';

const imageFileFilter = (req, file, callback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return callback(new BadRequestException('Only image files are allowed!'), false);
  }
  callback(null, true);
};

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AtGuard)
  @UseInterceptors(FileInterceptor('img', {
    fileFilter: imageFileFilter,
  }))
  async create(
    @Res() response,
    @GetCurrentUser('login') login,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { description: string}
  ) {
    let message = body.description;
    await this.postsService.create(login, {file, message}).then(() => {
      response.send({"message": "success"});
    }).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Get('findAll')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  findAll(@Res() response, @GetCurrentUser('login') login) {
    this.postsService.findAll(login).then((res) => {
      response.send(res)
    }).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Get('findFavorites')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  findFavorites(@Res() response, @GetCurrentUser('login') login) {
    this.postsService.findFavorites(login).then((res) => {
      response.send(res)
    }).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Post('findByUser')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  findByUser(@Res() response, @GetCurrentUser('login') urLogin, @Body() body: {login:string},) {
    this.postsService.findByUser(urLogin, body.login).then((res) => {
      response.send(res)
    }).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  @Post('likeState')
  update(@Res() response, @GetCurrentUser('login') login, @Body() body: {id: number, likeState:boolean}) {
    this.postsService.setLike(body.id ,login, body.likeState).then((res) => {
      response.send(res)
    }).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard, RoleGuard)
  @Roles("ADMIN")
  @Post('removePost')
  remove(@Res() response, @GetCurrentUser('login') login, @Body() body: {postId: number}) {
    this.postsService.remove(login, body.postId).then((res) => {
      response.send(res)
    }).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }
}
