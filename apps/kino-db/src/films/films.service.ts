import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Person } from "../persons/persons.model";
import { Film } from "./films.model";
import { FilmDTO } from "./dto/filmDTO";
import { CountriesService } from "../countries/countries.service";
import { FactsService } from "../facts/facts.service";
import { GenresService } from "../genres/genres.service";
import { PersonsService } from "../persons/persons.service";
import { CountryDTO } from "../countries/dto/countryDTO";
import { Country } from "../countries/countries.model";
import { GenreDTO } from "../genres/dto/genreDTO";
import { Genre } from "../genres/genres.model";
import { UpdateFilmDTO } from "./dto/updateFilmDTO";
import { Profession } from "../professions/professions.model";
import { Fact } from "../facts/facts.model";
import {Op, Sequelize} from "sequelize";
import {Comment} from "../comments/comments.model";

@Injectable()
export class FilmsService {

  constructor(@InjectModel(Film) private filmRepository: typeof Film,
              private countryService: CountriesService,
              private factService: FactsService,
              private genreService: GenresService,
              private personService: PersonsService
  ) {
  }

  async getFilmById(id: number) {
    const film = await this.filmRepository.findByPk(id, {
      include: [
        {
          model: Person,
          as: "persons",
          include: [
            {
              model: Profession,
              as: "professions"
            }
          ]
        },
        {
          model: Country,
          as: "countries"
        },
        {
          model: Genre,
          as: "genres"
        },
        {
          model: Fact,
          as: "fact"
        },
        {
          model: Comment,
          as: "comments"
        }
      ]
    });

    if (!film) {
      return null;
    }
    const similarFilms = await this.findFilmsByGenre(film.genres.map(g => g.nameRu));
    return {
      film,
      similarFilms
    };
  }

  async findFilmsByGenre(genreNames: string[]) {
    const films = await this.filmRepository.findAll({
      include: [
        {
          model: Genre,
          where: {
            [Op.or]: [
              { nameRu: genreNames },
              { nameEn: genreNames }
            ]
          }
        }
      ]
    });

    return films;
  }

  async updateFilm(id: number, dto: UpdateFilmDTO) {

    const film = await this.filmRepository.findByPk(id);
    if (!film) {
      throw new Error(`Film with id ${id} not found`);
    }

    await this.filmRepository.update({ ...dto }, { where: { id } });

    return film;
  }

  async getAllFilms() {
    const films = await this.filmRepository.findAll();
    return films;
  }

  async deleteFilm(id: number) {
    const film = await this.filmRepository.findByPk(id);
    if (!film) {
      throw new Error(`Film with id ${id} not found`);
    }
    await this.filmRepository.destroy({ where: { id: id } });
  }

  async getFilmByName(name: string) {
    const film = await this.filmRepository.findOne({
      where: {
        [Op.or]: [
          { filmNameRu: name },
          { filmNameEn: name }
        ]
      }
    });

    if (!film) {
      throw new Error(`Film with name ${name} not found`);
    }

    return film;
  }

  async searchFilmsByName(name: string) {
    const films = await this.filmRepository.findAll({
      where: {
        [Op.or]: [
          { filmNameRu: { [Op.like]: `%${name}%` } },
          { filmNameEn: { [Op.like]: `%${name}%` } }
        ]
      },
      limit: 10
    });


    return films;
  }


  // async filmFilters(page: number, perPage: number, genres?: string[], countries?: string[], persons?: string[], minRatingKp: number = 0, minVotesKp: number = 0, sortBy?: string) {
  //   const include = [];
  //   if (genres) {
  //     include.push({
  //       model: Genre,
  //       where: {
  //         [Op.or]: [
  //           { nameRu: genres },
  //           { nameEn: genres }
  //         ]
  //       }
  //     });
  //   }
  //   if (countries) include.push({ model: Country, where: { countryName: countries } });
  //   if (persons) include.push({
  //     model: Person,
  //     where: {
  //       [Op.or]: [
  //         { nameRu: persons },
  //         { nameEn: persons }
  //       ]
  //     }
  //   });
  //
  //   const order = [];
  //   if (sortBy === "rating") {
  //     order.push(["ratingKp", "DESC"]);
  //   } else if (sortBy === "novelty") {
  //     order.push(["premiereWorldDate", "DESC"]);
  //   } else {
  //     order.push(["votesKp", "DESC"]);
  //   }
  //
  //   const films = await this.filmRepository.findAll({
  //     include,
  //     where: {
  //       ratingKp: { [Op.gte]: minRatingKp },
  //       votesKp: { [Op.gte]: minVotesKp }
  //     },
  //     limit: perPage,
  //     offset: (page - 1) * perPage,
  //     order
  //   });
  //   return films;
  // }

  async filmFilters(
      page: number,
      perPage: number,
      genres?: string[],
      countries?: string[],
      persons?: string[],
      minRatingKp: number = 0,
      minVotesKp: number = 0,
      sortBy?: string,
      year?: number
  ) {
    const include = [];
    if (genres) {
      include.push({
        model: Genre,
        where: {
          [Op.or]: [
            { nameRu: genres },
            { nameEn: genres }
          ]
        }
      });
    }
    if (countries) include.push({ model: Country, where: { countryName: countries } });
    if (persons) include.push({
      model: Person,
      where: {
        [Op.or]: [
          { nameRu: persons },
          { nameEn: persons }
        ]
      }
    });

    const order = [];
    if (sortBy === "rating") {
      order.push(["ratingKp", "DESC"]);
    } else if (sortBy === "novelty") {
      order.push(["premiereWorldDate", "DESC"]);
    } else if (sortBy === "alphabet") {
      order.push(["filmNameRu", "ASC"]);
    } else {
      order.push(["votesKp", "DESC"]);
    }

    const where: any = {
      ratingKp: { [Op.gte]: minRatingKp },
      votesKp: { [Op.gte]: minVotesKp }
    };
    if (year) {
      where.year = year;
    }

    const films = await this.filmRepository.findAll({
      include,
      where,
      limit: perPage,
      offset: (page - 1) * perPage,
      order
    });
    return films;
  }



  async getAllFilmYears() {
    const years = await this.filmRepository.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('year')), 'year']],
      order: [[Sequelize.col('year'), 'ASC']]
    });

    return years.map((year) => year.year);
  }
}
