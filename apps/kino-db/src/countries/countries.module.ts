import { Module } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { Genre } from "../genres/genres.model";
import { Country } from "./countries.model";
import { Film } from "../films/films.model";
import { FilmPerson } from "../films/filmPerson";
import { FilmCountry } from "../films/filmCountry";
import { Fact } from "../facts/facts.model";
import { FilmGenre } from "../films/filmGenre";
import { Person } from "../persons/persons.model";
import { Profession } from "../professions/professions.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Film,FilmPerson,FilmCountry,Fact,FilmGenre,Country,Genre,Person,Profession])
  ],
  controllers: [CountriesController],
  providers: [CountriesService]
})
export class CountriesModule {}
