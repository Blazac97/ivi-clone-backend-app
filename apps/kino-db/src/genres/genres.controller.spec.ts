import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from './genres.controller';
import {GenresService} from "./genres.service";
import {Genre} from "./genres.model";
import {HttpStatus} from "@nestjs/common";

describe('GenresController', () => {
  let controller: GenresController;
  let service: GenresService;

  const mockGenre = { id: 1, nameRu: 'драма', nameEn: 'drama' };
  const mockGenreDto = { nameRu: 'драма', nameEn: 'drama' };

  const mockGenresService = {
    getAllGenres: jest.fn(),
    searchGenresByName: jest.fn(),
    updateGenre: jest.fn().mockResolvedValue(mockGenre),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        {
          provide: GenresService,
          useValue: mockGenresService,
        },
      ],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

    describe('getAll', () => {
    it('should return an array of users', async () => {

      mockGenresService.getAllGenres.mockResolvedValue(mockGenre);

      expect(await controller.getAllGenres()).toEqual(mockGenre);
      expect(service.getAllGenres).toHaveBeenCalledTimes(1);
    });
  });

  describe('searchGenresByName', () => {
    it('should return genres matching the given name', async () => {
      const genreName = 'дра';

      mockGenresService.searchGenresByName.mockResolvedValue(mockGenre);

      const result = await controller.searchGenresByName(genreName);

      expect(service.searchGenresByName).toHaveBeenCalledWith(genreName);
      expect(result).toEqual(mockGenre);
    });
  });

  describe('updateGenre', () => {
    it('should update the genre and return HttpStatus.OK', async () => {
      const id = 1;
      const mockResponse = HttpStatus.OK;

      const result = await controller.updateGenre({ id, dto: mockGenreDto });

      expect(service.updateGenre).toHaveBeenCalledWith(id, mockGenreDto);
      expect(result).toEqual(mockResponse);
    });
  });
});


