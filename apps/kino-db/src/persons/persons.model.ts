import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Profession } from "../professions/professions.model";
import { PersonProfession } from "./personProfession";
import { Film } from "../films/films.model";
import { FilmPerson } from "../films/filmPerson";
import {ApiProperty} from "@nestjs/swagger";


interface PersonCreationAtt {
  nameRu:string;
  nameEn:string;
}

@Table({tableName:'Person', timestamps:false})
export class Person extends Model<Person,PersonCreationAtt> {

  @ApiProperty({example:'1', description:'Уникальный идентификатор'})
  @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
  id:number

  @ApiProperty({description:'url фотографии'})
  @Column({type:DataType.STRING, unique:true,})
  photoUrl:string

  @ApiProperty({example:'Энди', description:'Имя на русском'})
  @Column({type:DataType.STRING, unique:true,})
  nameRu:string

  @ApiProperty({example:'Andy', description:'Имя на английском'})
  @Column({type:DataType.STRING, unique:true,})
  nameEn:string

  @BelongsToMany(() => Profession,() => PersonProfession)
  professions:Profession[]

  @BelongsToMany(() => Film,() => FilmPerson)
  films:Film[]

}