import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Profession } from "../professions/professions.model";
import { PersonProfession } from "./personProfession";
import { Film } from "../films/films.model";
import { FilmPerson } from "../films/filmPerson";


interface PersonCreationAtt {
  nameRu:string;
  nameEn:string;
}

@Table({tableName:'Person', timestamps:false})
export class Person extends Model<Person,PersonCreationAtt> {

  @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
  id:number

  @Column({type:DataType.INTEGER, unique:true,})
  kinopoiskId:number

  @Column({type:DataType.STRING, unique:true,})
  photoUrl:string

  @Column({type:DataType.STRING, unique:true,})
  nameRu:string

  @Column({type:DataType.STRING, unique:true,})
  nameEn:string

  @BelongsToMany(() => Profession,() => PersonProfession)
  professions:Profession[]

  @BelongsToMany(() => Film,() => FilmPerson)
  films:Film[]

}