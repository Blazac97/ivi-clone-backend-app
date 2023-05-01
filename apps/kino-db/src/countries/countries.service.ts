import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Genre } from "../genres/genres.model";
import { Country } from "./countries.model";
import { where } from "sequelize";
import { CountryDTO } from "./dto/countryDTO";

@Injectable()
export class CountriesService {

  constructor(@InjectModel(Country) private countryRepository: typeof Country) {
  }

  async getAllCountries() {
    const country = await this.countryRepository.findAll({ include: { all: true } });
    return country;

  }

  async findCountryByName(countryNames: string[]){
    const countries = await this.countryRepository.findAll({
      where: {
        countryName: countryNames,
      },
    });
    return countries;
  }


}
