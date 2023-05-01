import { Controller } from '@nestjs/common';
import { GenresService } from "../genres/genres.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CountriesService } from "./countries.service";

@Controller('countries')
export class CountriesController {

  constructor(private readonly countriesService: CountriesService,
  ) {}

  @MessagePattern('getAll.countries')
  async getAllCountries() {
    return  await this.countriesService.getAllCountries();
  }

}
