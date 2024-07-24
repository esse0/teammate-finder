import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Res, Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/auth.signup.dto';
import { AuthSigninDto } from './dto/auth.signin.dto';
import { AtGuard, RtGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthSignupDto, @Res() response: Response){
    this.authService.signup(dto).then(() => {
     response.send({message: "success"});
    }).catch((ex) => {response.status(ex.status).send(ex.response)})
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: AuthSigninDto, @Res() response: Response){
    this.authService.signin(dto).then(value => {
      response.cookie('accessToken', value.tokens.access_token, {
          httpOnly: true,
          sameSite: 'strict'
       });

       response.cookie('refreshToken', value.tokens.refresh_token, {
        httpOnly: true,
        sameSite: 'strict'
     });

     response.send({message: "success", login: value.user.login, role: value.user.role, id: value.user.id });
    }).catch((ex) => {response.status(ex.status).send(ex.response)});
  }
  
  @UseGuards(AtGuard)
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  signout(@GetCurrentUser('sub') userId, @Res() response: Response){
    
    this.authService.signout(userId).then(() => {
      response.clearCookie('accessToken');
      response.clearCookie('refreshToken');

      response.send({message: "success"});
    }).catch((ex) => {response.status(ex.status).send(ex.response)});
  }

  @UseGuards(AtGuard)
  @Post('isauth')
  @HttpCode(HttpStatus.OK)
  isauth(@GetCurrentUser('login') login, @GetCurrentUser('role') role, @Res() response: Response){
    this.authService.getUser(login).then( res => {
      response.send({"login": login, "role": role, "id": res.id });
    }).catch(ex=>{ response.status(403).send(); });
    
  }


  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(@GetCurrentUser('sub') userId, @Req() req: Request, @Res() response: Response){
    this.authService.refreshTokens(userId, req.cookies['refreshToken']).then(value => {
      response.cookie('accessToken', value.access_token, {
          httpOnly: true,
          sameSite: 'strict'
       });

       response.cookie('refreshToken', value.refresh_token, {
        httpOnly: true,
        sameSite: 'strict'
     });

     response.send({message: "success"});
    }).catch((ex) => {response.status(ex.status).send(ex.response)});
  }
}
