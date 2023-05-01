import { Person } from "../../persons/persons.model";
import { Country } from "../../countries/countries.model";
import { Genre } from "../../genres/genres.model";
import { Fact } from "../../facts/facts.model";
import { PersonDTO } from "../../persons/dto/personDTO";
import { CountryDTO } from "../../countries/dto/countryDTO";
import { GenreDTO } from "../../genres/dto/genreDTO";
import { FactDTO } from "../../facts/dto/factDTO";

export class FilmDTO {

  trailerName: string;
  trailerUrl: string;
  ratingKp: number;
  votesKp: number;
  ratingImdb: number;
  votesImdb: number;
  ratingFilmCritics: number;
  votesFilmCritics: number;
  ratingRussianFilmCritics: number;
  votesRussianFilmCritics: number;
  movieLength: number;
  originalFilmLanguage: string;
  filmNameRu: string;
  filmNameEn: string;
  description: string;
  premiereCountry: string;
  slogan: string;
  bigPictureUrl: string;
  smallPictureUrl: string;
  year: number;
  top10: number;
  top250: number;
  kinopoiskId: number;
  premiereWorldDate: Date;
  createdAt: Date;
  persons: PersonDTO[];
  countries: CountryDTO[];
  genres: GenreDTO[];
  fact: FactDTO;
}