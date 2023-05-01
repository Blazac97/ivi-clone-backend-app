import {BelongsToMany, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import { Country } from "../countries/countries.model";
import { Film } from "./films.model";
import { Genre } from "../genres/genres.model";



@Table({tableName:'_FilmToGenre',createdAt: false, updatedAt: false})
export class FilmGenre extends Model<FilmGenre> {

  @ForeignKey(() => Film)
  @Column({type:DataType.INTEGER})
  A:number

  @ForeignKey(() => Genre)
  @Column({type:DataType.INTEGER})
  B:number

}