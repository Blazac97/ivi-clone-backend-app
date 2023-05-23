import {IsIn, IsString} from "class-validator";

export class UpdateFilmDTO {
  @IsString({message: 'Должно быть строкой'})
  @IsIn(['ru'], { message: 'Имя должно состоять из кирилицы' })
  filmNameRu: string;
  @IsString({message: 'Должно быть строкой'})
  @IsIn(['en'], { message: 'Имя должно состоять из латиницы' })
  filmNameEn: string;


}