import { Person } from "../../persons/persons.model";
import { Country } from "../../countries/countries.model";
import { Genre } from "../../genres/genres.model";
import { Fact } from "../../facts/facts.model";

export class FactDTO {

  value: string;
  type: string;
  spoiler: boolean;

}