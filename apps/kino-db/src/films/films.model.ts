import { BelongsToMany, Column, DataType, HasOne, Model, Table } from "sequelize-typescript";

import { PersonProfession } from "../persons/personProfession";
import { Person } from "../persons/persons.model";
import { Country } from "../countries/countries.model";
import { Fact } from "../facts/facts.model";
import { FilmPerson } from "./filmPerson";
import { FilmCountry } from "./filmCountry";
import { Genre } from "../genres/genres.model";
import { FilmGenre } from "./filmGenre";



interface FilmCreationAtt {
  filmNameRu:string
}

@Table({tableName:'Film', timestamps:false})
export class Film extends Model<Film,FilmCreationAtt> {

  @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
  id:number

  @Column({type:DataType.STRING, })
  trailerName:string

  @Column({type:DataType.STRING, })
  trailerUrl:string

  @Column({type:DataType.DOUBLE, })
  ratingKp:number

  @Column({type:DataType.INTEGER, })
  votesKp:number

  @Column({type:DataType.DOUBLE, })
  ratingImdb:number

  @Column({type:DataType.INTEGER, })
  votesImdb:number

  @Column({type:DataType.DOUBLE, })
  ratingFilmCritics:number

  @Column({type:DataType.INTEGER, })
  votesFilmCritics:number

  @Column({type:DataType.DOUBLE, })
  ratingRussianFilmCritics:number

  @Column({type:DataType.INTEGER, })
  votesRussianFilmCritics:number

  @Column({type:DataType.INTEGER, })
  movieLength:number

  @Column({type:DataType.STRING, })
  originalFilmLanguage:string

  @Column({type:DataType.STRING, })
  filmNameRu:string

  @Column({type:DataType.STRING, })
  filmNameEn:string

  @Column({type:DataType.STRING, })
  description:string

  @Column({type:DataType.STRING, })
  premiereCountry:string

  @Column({type:DataType.STRING, })
  slogan:string

  @Column({type:DataType.STRING, })
  bigPictureUrl:string

  @Column({type:DataType.STRING, })
  smallPictureUrl:string

  @Column({type:DataType.INTEGER, })
  year:number

  @Column({type:DataType.INTEGER, })
  top10:number

  @Column({type:DataType.INTEGER, })
  top250:number

  @Column({type:DataType.INTEGER, })
  kinopoiskId:number

  @Column({type:DataType.DATE, })
  premiereWorldDate:Date

  @Column({type:DataType.DATE, defaultValue: DataType.NOW })
  createdAt:Date

  @BelongsToMany(() => Person,() => FilmPerson)
  persons:Person[]

  @BelongsToMany(() => Country,() => FilmCountry)
  countries:Country[]

  @BelongsToMany(() => Genre,() => FilmGenre)
  genres:Genre[]

  @HasOne(() => Fact)
  fact: Fact;
}