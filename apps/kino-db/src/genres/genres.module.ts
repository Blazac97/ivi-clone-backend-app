import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { Genre } from "./genres.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { FilmGenre } from "../films/filmGenre";
import { Film } from "../films/films.model";
import { FilmPerson } from "../films/filmPerson";
import { FilmCountry } from "../films/filmCountry";
import { Fact } from "../facts/facts.model";
import { Country } from "../countries/countries.model";
import { Person } from "../persons/persons.model";
import { Profession } from "../professions/professions.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Film,FilmPerson,FilmCountry,Fact,FilmGenre,Country,Genre,Person,Profession])
  ],
  providers: [GenresService],
  controllers: [GenresController]
})
export class GenresModule {}
