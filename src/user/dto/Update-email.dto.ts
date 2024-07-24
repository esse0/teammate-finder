import { IsEmail, NotContains } from "class-validator";

export class UpdateEmailDto{
    @IsEmail({}, {message:" Email must be an email. \n"})
    @NotContains(" ", {message:""})
    public email: string;
}