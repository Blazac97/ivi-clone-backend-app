
import { ProfessionDTO } from "../../professions/dto/professionDTO";

export class PersonDTO {

  kinopoiskId:number

  photoUrl:string

  nameRu:string

  nameEn:string

  professions:ProfessionDTO[]
}