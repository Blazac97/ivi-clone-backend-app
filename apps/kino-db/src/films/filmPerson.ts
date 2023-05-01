import {BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { Country } from "../countries/countries.model";
import { Film } from "./films.model";
import { Person } from "../persons/persons.model";



@Table({tableName:'_FilmToPerson',createdAt: false, updatedAt: false})
export class FilmPerson extends Model<FilmPerson> {

  @ForeignKey(() => Film)
  @Column({type:DataType.INTEGER})
  A:number

  @ForeignKey(() => Person)
  @Column({type:DataType.INTEGER})
  B:number

}