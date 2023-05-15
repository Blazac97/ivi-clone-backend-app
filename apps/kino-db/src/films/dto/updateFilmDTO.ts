import { Person } from "../../persons/persons.model";
import { Country } from "../../countries/countries.model";
import { Genre } from "../../genres/genres.model";
import { Fact } from "../../facts/facts.model";
import { PersonDTO } from "../../persons/dto/personDTO";
import { CountryDTO } from "../../countries/dto/countryDTO";
import { GenreDTO } from "../../genres/dto/genreDTO";
import { FactDTO } from "../../facts/dto/factDTO";

export class UpdateFilmDTO {

  filmNameRu: string;
  filmNameEn: string;


}