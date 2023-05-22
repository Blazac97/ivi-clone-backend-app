import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import {UsersService} from "../../../auth-users/src/users/users.service";
import {getModelToken} from "@nestjs/sequelize";
import {User} from "../../../auth-users/src/users/users.model";
import {RolesService} from "../../../auth-users/src/roles/roles.service";
import {JwtService} from "@nestjs/jwt";
import {Film} from "./films.model";
import {Fact} from "../facts/facts.model";
import {Op, Sequelize} from "sequelize";
import {Genre} from "../genres/genres.model";
import {Country} from "../countries/countries.model";
import {Person} from "../persons/persons.model";
import {Profession} from "../professions/professions.model";

describe('FilmsService', () => {
  let service: FilmsService;

  const mockFilm = {
    id: 1,
    trailerName: "string",
    trailerUrl: "string",
    ratingKp: 1,
    votesKp: 1,
    ratingImdb: 1,
    votesImdb: 1,
    ratingFilmCritics: 1,
    votesFilmCritics: 1,
    ratingRussianFilmCritics: 1,
    votesRussianFilmCritics: 1,
    movieLength: 1,
    originalFilmLanguage: "string",
    filmNameRu: "string",
    filmNameEn: "string",
    description: "string",
    premiereCountry: "string",
    slogan: "string",
    bigPictureUrl: "string",
    smallPictureUrl: "string",
    year: 1,
    top10: 1,
    top250: 1,
    premiereWorldDate: new Date('2023-05-10T16:34:56.833Z'),
    createdAt: new Date('2023-05-10T16:34:56.833Z'),
    persons: [],
    countries: [],
    genres: [],
    fact: Fact,
    comments: []
  };

  const mockUpdateDto = {
    filmNameEn: 'Updated Film Name En',
    filmNameRu: 'Updated Film Name Ru'
  };

  const mockFilmsRepository = {
    findAll: jest.fn().mockResolvedValue(mockFilm),
    findByPk: jest.fn().mockResolvedValue(mockFilm.id),
    update: jest.fn().mockResolvedValue(mockFilm.id).mockResolvedValue(mockUpdateDto),
    destroy: jest.fn().mockResolvedValue(mockFilm.id),
    findOne: jest.fn().mockResolvedValue(mockFilm),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService, {
          provide: getModelToken(Film),
          useValue: mockFilmsRepository
        }
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllFilms', () => {
    it('should return all films from the repository', async () => {

      mockFilmsRepository.findAll.mockResolvedValue(mockFilm);

      const result = await service.getAllFilms();

      expect(mockFilmsRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockFilm);
    });
  });

  describe('updateFilm', () => {
    it('should update the film with the provided id and DTO', async () => {

      mockFilmsRepository.findByPk.mockResolvedValue(mockFilm);

      await service.updateFilm(mockFilm.id, mockUpdateDto);

      expect(mockFilmsRepository.findByPk).toHaveBeenCalledTimes(1);
      expect(mockFilmsRepository.findByPk).toHaveBeenCalledWith(mockFilm.id);
      expect(mockFilmsRepository.update).toHaveBeenCalledTimes(1);
      expect(mockFilmsRepository.update).toHaveBeenCalledWith(
          { filmNameEn: mockUpdateDto.filmNameEn, filmNameRu: mockUpdateDto.filmNameRu },
          { where: { id: mockFilm.id } }
      );
    });

    it('should throw an error if the film with the provided id is not found', async () => {
      const filmId = 1;
      const updateDto = { filmNameEn: 'Updated Film Name En', filmNameRu: 'Updated Film Name Ru' };

      mockFilmsRepository.findByPk.mockResolvedValue(null);

      await expect(service.updateFilm(filmId, updateDto)).rejects.toThrowError(
          `Film with id ${filmId} not found`
      );

      expect(mockFilmsRepository.findByPk).toHaveBeenCalledTimes(1);
      expect(mockFilmsRepository.findByPk).toHaveBeenCalledWith(filmId);
      expect(mockFilmsRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteFilm', () => {
    it('should delete the film with the provided id', async () => {

      jest.spyOn(mockFilmsRepository, 'findByPk').mockResolvedValue(mockFilm);
      jest.spyOn(mockFilmsRepository, 'destroy').mockResolvedValue(null);

      await service.deleteFilm(mockFilm.id);

      expect(mockFilmsRepository.findByPk).toHaveBeenCalledWith(mockFilm.id);
      expect(mockFilmsRepository.destroy).toHaveBeenCalledWith({ where: { id: mockFilm.id } });
    });

    it('should throw an error if the film with the provided id is not found', async () => {

      jest.spyOn(mockFilmsRepository, 'findByPk').mockResolvedValue(null);

      await expect(service.deleteFilm(mockFilm.id)).rejects.toThrow(`Film with id ${mockFilm.id} not found`);
    });
  });

  describe('getFilmByName', () => {
    it('should return the film with the provided name', async () => {
      const name = 'Film Title';

      jest.spyOn(mockFilmsRepository, 'findOne').mockResolvedValue(mockFilm);

      const result = await service.getFilmByName(name);

      expect(mockFilmsRepository.findOne).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { filmNameRu: name },
            { filmNameEn: name },
          ],
        },
      });
      expect(result).toEqual(mockFilm);
    });

    it('should throw an error if the film with the provided name is not found', async () => {
      const name = 'Nonexistent Film';

      jest.spyOn(mockFilmsRepository, 'findOne').mockResolvedValue(null);

      await expect(service.getFilmByName(name)).rejects.toThrow(`Film with name ${name} not found`);
    });
  });

  describe('searchFilmsByName', () => {
    it('should return films matching the provided name', async () => {
      const name = 'Film';

      jest.spyOn(mockFilmsRepository, 'findAll').mockResolvedValue([mockFilm]);

      const result = await service.searchFilmsByName(name);

      expect(mockFilmsRepository.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { filmNameRu: { [Op.like]: `%${name}%` } },
            { filmNameEn: { [Op.like]: `%${name}%` } },
          ],
        },
        limit: 10,
      });
      expect(result).toEqual([mockFilm]);
    });
  });

  describe('getAllFilmYears', () => {
    it('should return all distinct film years in ascending order', async () => {
      const mockYears = [
        { year: 2000 },
        { year: 2001 },
        { year: 2002 },
      ];

      jest.spyOn(mockFilmsRepository, 'findAll').mockResolvedValue(mockYears);

      const result = await service.getAllFilmYears();

      expect(mockFilmsRepository.findAll).toHaveBeenCalledWith({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('year')), 'year']],
        order: [[Sequelize.col('year'), 'ASC']],
      });
      expect(result).toEqual([2000, 2001, 2002]);
    });
  });

  describe('filmFilters', () => {
    it('should return filtered films based on provided parameters', async () => {
      const mockPage = 1;
      const mockPerPage = 10;
      const mockGenres = ['Action', 'Thriller'];
      const mockCountries = ['USA', 'UK'];
      const mockPersons = ['Tom Cruise', 'Brad Pitt'];
      const mockMinRatingKp = 7;
      const mockMinVotesKp = 1000;
      const mockSortBy = 'rating';
      const mockYear = 2022;


      jest.spyOn(mockFilmsRepository, 'findAll').mockResolvedValue([mockFilm]);

      const result = await service.filmFilters(
          mockPage,
          mockPerPage,
          mockGenres,
          mockCountries,
          mockPersons,
          mockMinRatingKp,
          mockMinVotesKp,
          mockSortBy,
          mockYear
      );

      expect(mockFilmsRepository.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Genre,
            where: {
              [Op.or]: [
                { nameRu: mockGenres },
                { nameEn: mockGenres },
              ],
            },
          },
          {
            model: Country,
            where: { countryName: mockCountries },
          },
          {
            model: Person,
            where: {
              [Op.or]: [
                { nameRu: mockPersons },
                { nameEn: mockPersons },
              ],
            },
          },
        ],
        where: {
          ratingKp: { [Op.gte]: mockMinRatingKp },
          votesKp: { [Op.gte]: mockMinVotesKp },
          year: mockYear,
        },
        limit: mockPerPage,
        offset: (mockPage - 1) * mockPerPage,
        order: [['ratingKp', 'DESC']],
      });
      expect(result).toEqual([mockFilm]);
    });
  });

  describe('getFilmById', () => {
    it('should return the film with the specified ID and similar films', async () => {

      jest.spyOn(mockFilmsRepository, 'findByPk').mockResolvedValue(mockFilm);
      jest.spyOn(service, 'findFilmsByGenre').mockResolvedValue([mockFilm as unknown as Film]);

      const result = await service.getFilmById(mockFilm.id);

      expect(mockFilmsRepository.findByPk).toHaveBeenCalledWith(mockFilm.id, {
        include: [
          {
            model: Person,
            as: 'persons',
            include: [
              {
                model: Profession,
                as: 'professions',
              },
            ],
          },
          {
            model: Country,
            as: 'countries',
          },
          {
            model: Genre,
            as: 'genres',
          },
          {
            model: Fact,
            as: 'fact',
          },
        ],
      });
      expect(service.findFilmsByGenre).toHaveBeenCalledWith(mockFilm.genres.map(g => g.nameRu));
      expect(result).toEqual({
        film: mockFilm,
        similarFilms: [mockFilm],
      });
    });
  });
});
