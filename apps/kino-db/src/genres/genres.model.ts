import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Film } from "../films/films.model";
import { FilmGenre } from "../films/filmGenre";


interface GenreCreationAtt {
  nameRu:string;
  nameEn:string;
}

@Table({tableName:'Genre', timestamps:false})
export class Genre extends Model<Genre,GenreCreationAtt> {

  @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
  id:number

  @Column({type:DataType.STRING, unique:true,})
  nameRu:string

  @Column({type:DataType.STRING, unique:true,})
  nameEn:string

  @BelongsToMany(() => Film,() => FilmGenre)
  films:Film[]

}