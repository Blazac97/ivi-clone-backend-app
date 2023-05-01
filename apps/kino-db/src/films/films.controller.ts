import { Controller, HttpStatus } from "@nestjs/common";
import { PersonsService } from "../persons/persons.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { FilmsService } from "./films.service";
import { FilmDTO } from "./dto/filmDTO";

@Controller("films")
export class FilmsController {

  constructor(private readonly filmService: FilmsService
  ) {
  }

  @MessagePattern("getFilmById")
  async getFilmById(@Payload() id: number) {
    return await this.filmService.getFilmById(id);
  }

  @MessagePattern("createFilm")
  async createFilm(@Payload() dto: FilmDTO) {
    return await this.filmService.createFilm(dto);
  }

  @MessagePattern("updateFilm")
  async updateFilm(@Payload() data: { id: number, dto: FilmDTO }) {
    const { id, dto } = data;
    return await this.filmService.updateFilm(id, dto);
  }

  @MessagePattern("getAllFilms")
  async getAllFilms() {
    return await this.filmService.getAllFilms();
  }

  @MessagePattern("getFilmById")
  async deleteFilmById(@Payload() id: number) {
    await this.filmService.deleteFilm(id);
    return HttpStatus.OK;
  }

  @MessagePattern("getFilmByName")
  async getFilmByName(@Payload() name: string) {
    return await this.filmService.getFilmByName(name);
  }

  @MessagePattern("filters")
  async filters(@Payload() data: {
    genres?: string[], countries?: string[], persons?: string[],
    minRatingKp?: number, minVotesKp?: number
  }) {
    const { genres, countries, persons, minRatingKp, minVotesKp } = data;
    console.log(genres, countries, persons, minRatingKp, minVotesKp);
    return await this.filmService.filmFilters(genres, countries, persons, minRatingKp, minVotesKp);
  }
}
