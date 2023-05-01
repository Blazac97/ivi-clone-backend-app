import { Module } from '@nestjs/common';
import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './professions.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { Country } from "../countries/countries.model";
import { Profession } from "./professions.model";
import { Film } from "../films/films.model";
import { FilmPerson } from "../films/filmPerson";
import { FilmCountry } from "../films/filmCountry";
import { Fact } from "../facts/facts.model";
import { FilmGenre } from "../films/filmGenre";
import { Genre } from "../genres/genres.model";
import { Person } from "../persons/persons.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Film,FilmPerson,FilmCountry,Fact,FilmGenre,Country,Genre,Person,Profession])
  ],
  controllers: [ProfessionsController],
  providers: [ProfessionsService]
})
export class ProfessionsModule {}
