import {BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table} from "sequelize-typescript";

import { PersonProfession } from "../persons/personProfession";
import { Person } from "../persons/persons.model";
import { Country } from "../countries/countries.model";
import { Fact } from "../facts/facts.model";
import { FilmPerson } from "./filmPerson";
import { FilmCountry } from "./filmCountry";
import { Genre } from "../genres/genres.model";
import { FilmGenre } from "./filmGenre";
import {Comment} from "../comments/comments.model";
import {ApiProperty} from "@nestjs/swagger";



interface FilmCreationAtt {
  filmNameRu:string
}

@Table({tableName:'Film', timestamps:false})
export class Film extends Model<Film,FilmCreationAtt> {

  @ApiProperty({example:'1', description:'Уникальный идентификатор'})
  @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
  id:number

  @ApiProperty({example:'имя', description:'Имя трейлера'})
  @Column({type:DataType.STRING, })
  trailerName:string

  @ApiProperty({example:'url', description:'url трейлера'})
  @Column({type:DataType.STRING, })
  trailerUrl:string

  @ApiProperty({example:'8.4', description:'рейтинг кинопоиска'})
  @Column({type:DataType.DOUBLE, })
  ratingKp:number

  @ApiProperty({example:'110', description:'кол-во голосов'})
  @Column({type:DataType.INTEGER, })
  votesKp:number

  @ApiProperty({example:'8.4', description:'рейтинг imdb'})
  @Column({type:DataType.DOUBLE, })
  ratingImdb:number

  @ApiProperty({example:'110', description:'кол-во голосов'})
  @Column({type:DataType.INTEGER, })
  votesImdb:number

  @ApiProperty({example:'5', description:'рейтинг критиков'})
  @Column({type:DataType.DOUBLE, })
  ratingFilmCritics:number

  @ApiProperty({example:'110', description:'кол-во голосов критиков'})
  @Column({type:DataType.INTEGER, })
  votesFilmCritics:number

  @ApiProperty({example:'5', description:'рейтинг критиков'})
  @Column({type:DataType.DOUBLE, })
  ratingRussianFilmCritics:number

  @ApiProperty({example:'110', description:'кол-во голосов критиков'})
  @Column({type:DataType.INTEGER, })
  votesRussianFilmCritics:number

  @ApiProperty({example:'110', description:'длительнотсь фильма'})
  @Column({type:DataType.INTEGER, })
  movieLength:number

  @ApiProperty({example:'eng', description:'язык оригинала фильма'})
  @Column({type:DataType.STRING, })
  originalFilmLanguage:string

  @ApiProperty({example:'имя', description:'Имя фильма русское'})
  @Column({type:DataType.STRING, })
  filmNameRu:string

  @ApiProperty({example:'name', description:'Имя фильма английское'})
  @Column({type:DataType.STRING, })
  filmNameEn:string

  @ApiProperty({example:'описание', description:'описание фильма'})
  @Column({type:DataType.STRING, })
  description:string

  @ApiProperty({example:'1.10.2020', description:'дата приемьеры фильма'})
  @Column({type:DataType.STRING, })
  premiereCountry:string

  @ApiProperty({example:'слоган', description:'слоган фильма'})
  @Column({type:DataType.STRING, })
  slogan:string

  @ApiProperty({example:'url', description:'url картинки фильма'})
  @Column({type:DataType.STRING, })
  bigPictureUrl:string

  @ApiProperty({example:'url', description:'url картинки фильма'})
  @Column({type:DataType.STRING, })
  smallPictureUrl:string

  @ApiProperty({example:'2022', description:'год создания фильма'})
  @Column({type:DataType.INTEGER, })
  year:number

  @ApiProperty({example:'1', description:'номер в топ10'})
  @Column({type:DataType.INTEGER, })
  top10:number

  @ApiProperty({example:'1', description:'номер в топ250'})
  @Column({type:DataType.INTEGER, })
  top250:number


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

  @HasMany(() => Comment)
  comments: Comment
}