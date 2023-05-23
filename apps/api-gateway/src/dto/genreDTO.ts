import {IsIn, IsString} from "class-validator";

export class GenreDTO {

  @IsString({message: 'Должно быть строкой'})
  @IsIn(['ru'], { message: 'Имя должно состоять из кирилицы' })
  nameRu:string;
  @IsString({message: 'Должно быть строкой'})
  @IsIn(['en'], { message: 'Имя должно состоять из латиницы' })
  nameEn:string;

}