import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Film } from "../films/films.model";
import { FilmCountry } from "../films/filmCountry";


interface CountryCreationAtt {
  countryName:string;
}

@Table({tableName:'Country', timestamps:false})
export class Country extends Model<Country,CountryCreationAtt> {

  @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
  id:number

  @Column({type:DataType.STRING, unique:true,})
  countryName:string

  @Column({type:DataType.STRING, unique:true,})
  countryNameEn:string

  @BelongsToMany(() => Film,() => FilmCountry)
  films:Film[]

}