import {Controller, HttpStatus} from "@nestjs/common";
import {PersonsService} from "../persons/persons.service";
import {MessagePattern, Payload} from "@nestjs/microservices";
import {FilmsService} from "./films.service";
import {FilmDTO} from "./dto/filmDTO";
import {UpdateFilmDTO} from "./dto/updateFilmDTO";

@Controller("films")
export class FilmsController {

    constructor(private readonly filmService: FilmsService
    ) {
    }

    @MessagePattern("getFilmById")
    async getFilmById(@Payload() id: number) {
        return await this.filmService.getFilmById(id);
    }

    @MessagePattern("updateFilm")
    async updateFilm(@Payload() data: { id: number, dto: UpdateFilmDTO }) {
        const {id, dto} = data;
        return await this.filmService.updateFilm(id, dto);
    }

    @MessagePattern("getAllFilms")
    async getAllFilms() {
        return await this.filmService.getAllFilms();
    }

    @MessagePattern("deleteFilmById")
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
        page: number, perPage: number,
        genres?: string[], countries?: string[], persons?: string[],
        minRatingKp?: number, minVotesKp?: number, sortBy?: string, year?: number
    }) {
        const {
            page, perPage, genres, countries,
            persons, minRatingKp, minVotesKp,
            sortBy, year
        } = data;
        return await this.filmService.filmFilters(page, perPage, genres,
            countries, persons, minRatingKp,
            minVotesKp, sortBy, year);
    }

    @MessagePattern("getAllFilmYears")
    async getAllFilmYears() {
        return await this.filmService.getAllFilmYears();
    }

    @MessagePattern("searchFilmsByName")
    async searchFilmsByName(@Payload() name: string) {
        return await this.filmService.searchFilmsByName(name);
    }
}
