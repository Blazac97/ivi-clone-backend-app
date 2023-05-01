import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Film } from "../films/films.model";
import { FilmPerson } from "../films/filmPerson";
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

  @BelongsToMany(() => Film,() => FilmCountry)
  films:Film[]

}