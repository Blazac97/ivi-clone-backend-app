import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import {Op} from "sequelize";
import {getModelToken} from "@nestjs/sequelize";
import {Genre} from "./genres.model";


describe('GenresService', () => {
  let service: GenresService;

  const mockGenre = { id: 1, nameRu: 'драма', nameEn: 'drama' };
  const mockGenreDto = { nameRu: 'драма', nameEn: 'drama' };

  const mockGenresRepository = {
    findAll: jest.fn().mockResolvedValue(mockGenre),
    update: jest.fn().mockImplementation((dto, options) => {
      return { ...dto, id: options.where.id };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getModelToken(Genre),
          useValue: mockGenresRepository,
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllGenres', () => {
    it('should return an array of genres', async () => {
      mockGenresRepository.findAll.mockResolvedValue(mockGenre);

      expect(await service.getAllGenres()).toEqual(mockGenre);
      expect(mockGenresRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateGenre', () => {
    it('should update the genre', async () => {
      const updatedGenre = await service.updateGenre(mockGenre.id, mockGenreDto);

      expect(mockGenresRepository.update).toHaveBeenCalledWith(mockGenreDto, { where: { id: mockGenre.id } });
      expect(updatedGenre).toEqual({ ...mockGenreDto, id: mockGenre.id });
    });
  });

  describe('searchGenre', () => {
    it('should return an array of genres that match the genre name', async () => {
      const genreName = 'дра';

      const result = await service.searchGenresByName(genreName);

      expect(mockGenresRepository.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { nameRu: { [Op.iLike]: `%${genreName}%` } },
            { nameEn: { [Op.iLike]: `%${genreName}%` } },
          ],
        },
        limit: 10,
      });
      expect(result).toEqual(mockGenre);
    });
  });
});

