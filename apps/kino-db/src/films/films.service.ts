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
import { Op } from "sequelize";

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
        }
      ]
    });

    if (!film) {
      return null;
    }

    return film;
  }


  async createFilm(dto: FilmDTO) {

    const film = await this.filmRepository.create(dto);

    const fact = await this.factService.createFact(dto.fact, film.id);

    await this.processDTO(dto, film);

    return film;
  }

  async updateFilm(id: number, dto: FilmDTO) {

    const film = await this.filmRepository.findByPk(id);
    if (!film) {
      throw new Error(`Film with id ${id} not found`);
    }

    const updateDto: UpdateFilmDTO = { ...dto };
    await this.filmRepository.update({ ...updateDto }, { where: { id } });

    const fact = await this.factService.updateFact(dto.fact, id);

    await this.processDTO(dto, film);

    return film;
  }

  async processDTO(dto: FilmDTO, film: Film) {
    const countryNames = dto.countries.map((c: CountryDTO) => c.countryName);
    const countries = await this.countryService.findCountryByName(countryNames);
    if (countries.includes(null)) {
      throw new Error("One or more country names could not be found");
    }
    const countryIds = countries.map((c: Country) => c.id);
    await film.$set("countries", countryIds);
    film.countries = countries;

    const genreNames = dto.genres.map((g: GenreDTO) => g.nameRu);
    const genres = await this.genreService.findGenreByNameRU(genreNames);
    if (genres.includes(null)) {
      throw new Error("One or more genre names could not be found");
    }
    const genreIds = genres.map((g: Genre) => g.id);
    await film.$set("genres", genreIds);
    film.genres = genres;

    const personNames = dto.persons.map(p => p.nameRu);
    const persons = await this.personService.findPersonByNameRU(personNames);
    const createdPersons = [];
    const personsToCreate = [];
    for (const personDTO of dto.persons) {
      const person = persons.find(p => p.nameRu === personDTO.nameRu);
      if (!person) {
        personsToCreate.push(personDTO);
      } else {
        createdPersons.push(person);
      }
    }
    if (personsToCreate.length > 0) {
      const newPersons = await this.personService.createPersons(personsToCreate);
      createdPersons.push(...newPersons);
    }
    const personIds = createdPersons.map(p => p.id);
    await film.$set("persons", personIds);
    film.persons = createdPersons;
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

  async filmFilters(genres?: string[], countries?: string[], persons?: string[], minRatingKp: number = 0, minVotesKp: number = 0) {
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

    const films = await this.filmRepository.findAll({
      include,
      where: {
        ratingKp: { [Op.gte]: minRatingKp },
        votesKp: { [Op.gte]: minVotesKp }
      }
    });
    return films;
  }

  async sortFilmsByVotesKp() {
    const films = await this.filmRepository.findAll({
      order: [["votesKp", "DESC"]]
    });
    return films;
  }

  async sortFilmsByRatingKp() {
    const films = await this.filmRepository.findAll({
      order: [["ratingKp", "DESC"]]
    });
    return films;
  }

  async sortByPremiereDate() {
    const films = await this.filmRepository.findAll({
      order: [["premiereWorldDate", "DESC"]]
    });
    return films;
  }

  async sortFilmsAlphabetically() {
    const films = await this.filmRepository.findAll({
      order: [
        ["filmNameRu", "ASC"]
      ]
    });
    return films;
  }
}
