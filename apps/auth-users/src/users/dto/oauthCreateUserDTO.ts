import { IsEmail, IsString, Length } from "class-validator";

export class OauthCreateUserDTO {
    @IsString({message: 'Должно быть строкой'})
    @IsEmail({}, {message: "Некорректный email"})
    readonly email: string;

}