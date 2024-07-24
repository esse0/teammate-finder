import { IsNotEmpty, IsEmail, IsString, Length, NotContains, Matches, Validate } from "class-validator";
import { CustomMatchPasswords } from "./password.validator";

export class AuthSignupDto {
    @IsEmail({}, {message:"Email must be an email. \n"})
    @NotContains(" ", {message:""})
    public email: string;

    @IsString({message:""})
    @IsNotEmpty({message:""})
    @NotContains(" ", {message:""})
    @Matches(/^[A-Za-z][0-9A-Za-z]{0,25}$/, { message: 'The login should contain only numbers and chars and start with char. \n'})
    @Length(4, 20, { message: 'Username has to be at between 4 and 20 chars. \n'})
    public login: string

    @IsNotEmpty({message:""})
    @IsString({message:""})
    @NotContains(" ", {message:""})
    @Length(5, 20, { message: 'Password has to be at between 5 and 20 chars. \n'})
    @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{0,25}$/, 
    {message: 'The password should contain at least 1 uppercase character, 1 lowercase, 1 number. \n'})
    public password: string;

    @Validate(CustomMatchPasswords, ['password'], {message: ""})
    public passwordConfirm: string;
}