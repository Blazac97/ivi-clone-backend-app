import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import {UsersService} from "../../../auth-users/src/users/users.service";
import {getModelToken} from "@nestjs/sequelize";
import {User} from "../../../auth-users/src/users/users.model";
import {RolesService} from "../../../auth-users/src/roles/roles.service";
import {JwtService} from "@nestjs/jwt";
import {Film} from "./films.model";
import {Fact} from "../facts/facts.model";

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
});
