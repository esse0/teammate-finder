import { Controller, Get, Post, Body, Patch, HttpStatus, HttpCode, UseGuards, Query, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { AtGuard } from 'src/common/guards/at.guard';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { UpdatePasswordDto } from './dto/Update-password.dto';
import { UpdateEmailDto } from './dto/Update-email.dto';
import { UpdateInfoDto } from './dto/UpdateInfo.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('createChat')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async createChat(@Res() response, @GetCurrentUser('login') userLogin, @Body('login') flogin: string) {
    await this.userService.createChat(userLogin, flogin).then(chats => {{
      response.send({"message": "success"});
    }}).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Get('findAll')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(@Res() response, @GetCurrentUser('login') userLogin,) {
    await this.userService.findAll(userLogin).then(users => {{
      response.send({"user": users});
    }}).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Get('findOne')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async findOne(@Query('login') login: string, @Res() response) {
    if(login == "") response.status(400).send();
    else{
      await this.userService.findOne(login).then(user => {{
        response.send({"user": user});
      }}).catch(ex => {
        console.log(ex)
        response.status(ex.status).send(ex.response);
      });
    }
  }

  @Get('findFollowing')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async findFollowing(@Query('login') login: string, @Res() response) {
    await this.userService.findFollowing(login).then(friends => {{
      response.send({"friends": [...friends]});
    }}).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Get('findFollowed')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async findFollowed(@Query('login') login: string, @Res() response) {
    await this.userService.findFollowed(login).then(friends => {{
      response.send({"friends": [...friends]});
    }}).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Patch('updateInfo')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async updateInfo(@GetCurrentUser('sub') userId, @Body() updateDto: UpdateInfoDto, @Res() response) {
    await this.userService.updateInfo(userId, updateDto).then(result => {{
      response.send({"message": 'success'});
    }}).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Patch('updatePassword')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async updatePassword(@GetCurrentUser('sub') userId, @Body() updateDto: UpdatePasswordDto, @Res() response) {
   await this.userService.updatePassword(userId, updateDto).then(result => {{
      response.send({"message": 'success'});
    }}).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Patch('updateEmail')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async updateEmail(@GetCurrentUser('sub') userId, @Body() updateDto: UpdateEmailDto, @Res() response) {
    await this.userService.updateEmail(userId, updateDto).then(result => {{
      response.send({"message": 'success'});
    }}).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Patch('subscribeToUser')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async subscribe(@Res() response, @GetCurrentUser('login') userLogin, @Body('login') subscribesDto: string,) {
    await this.userService.subscribeToUser(userLogin, subscribesDto).then(result => {{
      response.send({"message": "success"});
    }}).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Patch('unsubscribeFromUser')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async unsubscribe(@Res() response, @GetCurrentUser('login') userLogin, @Body('login') subscribesDto: string) {
    await this.userService.unsubscribeFromUser(userLogin, subscribesDto).then(result => {{
      response.send({"message": "success"});
    }}).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }

  @Patch('updateSteamLink')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async updateSteamLink(@GetCurrentUser('sub') userId, @Body() updateDto: {steamId: number | null}, @Res() response) {
    await this.userService.updateSteamLink(userId, updateDto.steamId).then(result => {{
      response.send({"message": 'success'});
    }}).catch(ex => {
      
      response.status(ex.status).send(ex.response);
    });
  }

  @Post('getGames')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  async getGames(@Body('login') subscribesDto: string, @Res() response) {
    await this.userService.getGames(subscribesDto).then(result => {{
      response.send(result);
    }}).catch(ex => {
      response.status(ex.status).send(ex.response);
    });
  }
}
