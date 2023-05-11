import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import {SequelizeModule} from "@nestjs/sequelize";
import {Film} from "../films/films.model";
import {Country} from "../countries/countries.model";
import {Person} from "../persons/persons.model";
import {Genre} from "../genres/genres.model";
import {FilmGenre} from "../films/filmGenre";
import {Fact} from "../facts/facts.model";
import {FilmCountry} from "../films/filmCountry";
import {FilmPerson} from "../films/filmPerson";
import {Profession} from "../professions/professions.model";
import {Comment} from "./comments.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Film,FilmPerson,FilmCountry,Fact,FilmGenre,Country,Genre,Person,Profession,Comment])
  ],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule {}
