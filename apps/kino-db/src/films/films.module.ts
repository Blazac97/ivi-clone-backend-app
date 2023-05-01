import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { SequelizeModule } from "@nestjs/sequelize";
import { Person } from "../persons/persons.model";
import { PersonProfession } from "../persons/personProfession";
import { Film } from "./films.model";
import { FilmPerson } from "./filmPerson";
import { FilmCountry } from "./filmCountry";
import { Fact } from "../facts/facts.model";
import { FilmGenre } from "./filmGenre";
import { Country } from "../countries/countries.model";
import { Genre } from "../genres/genres.model";
import { FactsModule } from "../facts/facts.module";
import { PersonsModule } from "../persons/persons.module";
import { CountriesModule } from "../countries/countries.module";
import { GenresModule } from "../genres/genres.module";
import { FactsService } from "../facts/facts.service";
import { PersonsService } from "../persons/persons.service";
import { CountriesService } from "../countries/countries.service";
import { GenresService } from "../genres/genres.service";
import { ProfessionsService } from "../professions/professions.service";
import { Profession } from "../professions/professions.model";
import { ProfessionsModule } from "../professions/professions.module";
import { UpdateFilmDTO } from "./dto/updateFilmDTO";

@Module({
  imports: [
    SequelizeModule.forFeature([Film,FilmPerson,FilmCountry,Fact,FilmGenre,Country,Genre,Person,Profession]),
    FactsModule,
    PersonsModule,
    CountriesModule,
    GenresModule,
    ProfessionsModule
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FactsService, PersonsService, CountriesService, GenresService, ProfessionsService]
})
export class FilmsModule {}
