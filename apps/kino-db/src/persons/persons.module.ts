import { Module } from '@nestjs/common';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { Profession } from "../professions/professions.model";
import { PersonProfession } from "./personProfession";
import {  Person } from "./persons.model";
import { ProfessionsModule } from "../professions/professions.module";
import { ProfessionsService } from "../professions/professions.service";
import { Film } from "../films/films.model";
import { FilmPerson } from "../films/filmPerson";
import { FilmCountry } from "../films/filmCountry";
import { Fact } from "../facts/facts.model";
import { FilmGenre } from "../films/filmGenre";
import { Country } from "../countries/countries.model";
import { Genre } from "../genres/genres.model";


@Module({
  imports: [
    SequelizeModule.forFeature([Film,FilmPerson,FilmCountry,Fact,FilmGenre,Country,Genre,Person,Profession]),
    ProfessionsModule
  ],
  controllers: [PersonsController],
  providers: [PersonsService, ProfessionsService]
})
export class PersonsModule {}
