import { PersonDTO } from "./personDTO";
import { CountryDTO } from "./countryDTO";
import { GenreDTO } from "./genreDTO";
import { FactDTO } from "./factDTO";


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