import { IsNotEmpty, IsString, Length, Matches, NotContains, Validate } from "class-validator";
import { CustomMatchPasswords } from "src/auth/dto/password.validator";

export class UpdatePasswordDto{
    @IsNotEmpty()
    @IsString()
    public OldPassword: string;

    @IsNotEmpty({message:""})
    @IsString({message:""})
    @NotContains(" ", {message:""})
    @Length(5, 20, { message: ' Password has to be at between 5 and 20 chars. \n'})
    @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{0,25}$/, 
    {message: ' The password should contain at least 1 uppercase character, 1 lowercase, 1 number. \n'})
    public NewPassword: string;

    @Validate(CustomMatchPasswords, ['NewPassword'], {message: ""})
    public NewPasswordConfirm: string;
}