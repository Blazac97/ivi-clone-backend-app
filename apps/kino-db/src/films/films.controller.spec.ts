import {Test, TestingModule} from '@nestjs/testing';
import {FilmsController} from './films.controller';
import {FilmsService} from "./films.service";
import {Film} from "./films.model";
import {Fact} from "../facts/facts.model";
import {UpdateFilmDTO} from "./dto/updateFilmDTO";
import {HttpStatus} from "@nestjs/common";

describe('FilmsController', () => {
  let controller: FilmsController;
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

  const mockUpdateFilmDTO: UpdateFilmDTO = {
    filmNameRu: "string",
    filmNameEn: "string"
  };

  const mockFilmsService = {
    getFilmById: jest.fn().mockResolvedValue(mockFilm.id),
    updateFilm: jest.fn().mockResolvedValue(mockFilm.id),
    getAllFilms: jest.fn(),
    deleteFilm: jest.fn(),
    getFilmByName:jest.fn().mockResolvedValue(mockFilm.filmNameRu),
    getAllFilmYears: jest.fn(),
    searchFilmsByName: jest.fn().mockResolvedValue(mockFilm.filmNameRu),
    filmFilters: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    }).overrideProvider(FilmsService).useValue(mockFilmsService).compile();


    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilmById', () => {
    it('should call filmService.getFilmById with the provided id', async () => {
      const id = 1;

      jest.spyOn(service, 'getFilmById').mockResolvedValue({
        film: mockFilm as unknown as Film,
        similarFilms: [],
      });

      await service.getFilmById(id);

      const result = await controller.getFilmById(id);

      expect(service.getFilmById).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        film: mockFilm,
        similarFilms: [],
      });
    });
  });

  describe('updateFilm', () => {
    it('should call filmService.updateFilm with the provided id and DTO', async () => {

      const updateFilmSpy = jest.spyOn(service, 'updateFilm').mockResolvedValue(mockFilm as unknown as Film);

      const result = await controller.updateFilm({id: mockFilm.id, dto: mockUpdateFilmDTO});

      expect(updateFilmSpy).toHaveBeenCalledWith(mockFilm.id,mockUpdateFilmDTO);
      expect(result).toBe(HttpStatus.OK);
    });
  });

  describe('getAllFilms', () => {
    it('should call filmService.getAllFilms', async () => {
      const getAllFilmsSpy = jest.spyOn(service, 'getAllFilms').mockResolvedValue([]);

      const result = await controller.getAllFilms();

      expect(getAllFilmsSpy).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('deleteFilmById', () => {
    it('should call filmService.deleteFilm with the provided id', async () => {
      const id = 1;
      const deleteFilmSpy = jest.spyOn(service, 'deleteFilm').mockResolvedValue();

      const result = await controller.deleteFilmById(id);

      expect(deleteFilmSpy).toHaveBeenCalledWith(id);
      expect(result).toBe(HttpStatus.OK);
    });
  });

  describe('getFilmByName', () => {
    it('should call filmService.getFilmByName with the provided name', async () => {
      const name = 'Film Name';

      const getFilmByNameSpy = jest.spyOn(service, 'getFilmByName').mockResolvedValue(mockFilm as unknown as Film);

      const result = await controller.getFilmByName(name);

      expect(getFilmByNameSpy).toHaveBeenCalledWith(name);
      expect(result).toEqual(mockFilm);
    });
  });

  describe('getAllFilmYears', () => {
    it('should call filmService.getAllFilmYears', async () => {
      const mockYears = [2020, 2021, 2022];
      const getAllFilmYearsSpy = jest.spyOn(service, 'getAllFilmYears').mockResolvedValue(mockYears);

      const result = await controller.getAllFilmYears();

      expect(getAllFilmYearsSpy).toHaveBeenCalled();
      expect(result).toEqual(mockYears);
    });
  });

  describe('searchFilmsByName', () => {
    it('should call filmService.searchFilmsByName with the provided name', async () => {
      const name = 'Film Name';

      const getFilmByNameSpy = jest.spyOn(service, 'searchFilmsByName').mockResolvedValue([mockFilm as unknown as Film]);

      const result = await controller.searchFilmsByName(name);

      expect(getFilmByNameSpy).toHaveBeenCalledWith(name);
      expect(result).toEqual([mockFilm]);
    });
  });

  describe('filters', () => {
    it('should call filmService.filmFilters with the provided data', async () => {
      const mockData = {
        page: 1,
        perPage: 10,
        genres: ['Action', 'Drama'],
        countries: ['USA', 'UK'],
        persons: ['Actor 1', 'Actor 2'],
        minRatingKp: 7,
        minVotesKp: 1000,
        sortBy: 'ratingKp',
        year: 2021,
      };

      const filmFiltersSpy = jest
          .spyOn(service, 'filmFilters')
          .mockResolvedValue([mockFilm as unknown as Film]);

      const result = await controller.filters(mockData);

      expect(filmFiltersSpy).toHaveBeenCalledWith(
          mockData.page,
          mockData.perPage,
          mockData.genres,
          mockData.countries,
          mockData.persons,
          mockData.minRatingKp,
          mockData.minVotesKp,
          mockData.sortBy,
          mockData.year,
      );
      expect(result).toEqual([mockFilm]);
    });
  });
});