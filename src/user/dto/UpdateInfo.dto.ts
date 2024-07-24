import { IsNotEmpty, IsString, MaxLength } from "class-validator"

export class UpdateInfoDto{
    @IsNotEmpty()
    @IsString()
    @MaxLength(100, { message: ' Bio has to be at between 0 and 100 chars. \n'})
    bio:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(20, { message: ' First name has to be at between 0 and 20 chars. \n'})
    firstName:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(20, { message: ' Last name has to be at between 0 and 20 chars. \n'})
    lastName:string

    @IsNotEmpty()
    @IsString()
    @MaxLength(20, { message: ' Patronymic has to be at between 0 and 20 chars. \n'})
    patronymic: string
}