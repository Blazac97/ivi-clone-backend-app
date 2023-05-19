import { Test, TestingModule } from '@nestjs/testing';
import { Op } from 'sequelize';
import { getModelToken } from '@nestjs/sequelize';
import { CountriesService } from './countries.service';
import { Country } from './countries.model';

describe('CountriesService', () => {
  let service: CountriesService;

  const mockCountry = { id: 1, nameRu: 'США', nameEn: 'USA' };

  const mockCountriesRepository = {
    findAll: jest.fn().mockResolvedValue(mockCountry),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: getModelToken(Country),
          useValue: mockCountriesRepository,
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCountries', () => {
    it('should return an array of countries', async () => {
      mockCountriesRepository.findAll.mockResolvedValue(mockCountry);

      expect(await service.getAllCountries()).toEqual(mockCountry);
      expect(mockCountriesRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('searchCountry', () => {
    it('should return an array of countries that match the country names', async () => {
      const countryNames = ['Сш'];

      const result = await service.findCountryByName(countryNames);

      expect(mockCountriesRepository.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { countryName: countryNames },
            { countryNameEn: countryNames },
          ],
        },
      });
      expect(result).toEqual(mockCountry);
    });
  });
});
