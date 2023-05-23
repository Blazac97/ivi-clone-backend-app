import {IsEmail, IsString} from "class-validator";

export class CommentDTO {

    @IsString({message: 'Должно быть строкой'})
    header:string;
    @IsString({message: 'Должно быть строкой'})
    value:string;
    parentId:number;

}