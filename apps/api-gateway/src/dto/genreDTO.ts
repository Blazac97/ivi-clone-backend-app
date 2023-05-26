import {IsString} from "class-validator";

export class GenreDTO {

  @IsString({message: 'Должно быть строкой'})

  nameRu:string;
  @IsString({message: 'Должно быть строкой'})

  nameEn:string;

}