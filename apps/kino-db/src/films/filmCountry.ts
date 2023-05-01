import {BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { Country } from "../countries/countries.model";
import { Film } from "./films.model";



@Table({tableName:'_CountryToFilm',createdAt: false, updatedAt: false})
export class FilmCountry extends Model<FilmCountry> {

  @ForeignKey(() => Country)
  @Column({type:DataType.INTEGER})
  A:number

  @ForeignKey(() => Film)
  @Column({type:DataType.INTEGER})
  B:number

}