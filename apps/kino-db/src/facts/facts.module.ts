import { Module } from '@nestjs/common';
import { FactsController } from './facts.controller';
import { FactsService } from './facts.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { PersonProfession } from "../persons/personProfession";
import { Fact } from "./facts.model";
import { Film } from "../films/films.model";
import { FilmPerson } from "../films/filmPerson";
import { FilmCountry } from "../films/filmCountry";
import { FilmGenre } from "../films/filmGenre";
import { Country } from "../countries/countries.model";
import { Genre } from "../genres/genres.model";
import { Person } from "../persons/persons.model";
import { Profession } from "../professions/professions.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Film,FilmPerson,FilmCountry,Fact,FilmGenre,Country,Genre,Person,Profession])
  ],
  controllers: [FactsController],
  providers: [FactsService]
})
export class FactsModule {}
