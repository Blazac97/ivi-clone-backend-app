import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Country } from "./countries.model";
import {Op, where} from "sequelize";

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
        [Op.or]: [
          { countryName: countryNames },
          { countryNameEn: countryNames }
        ]
      }
    });
    return countries;
  }


}
