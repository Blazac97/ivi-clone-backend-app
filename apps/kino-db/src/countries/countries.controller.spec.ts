import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

describe('CountriesController', () => {
  let controller: CountriesController;
  let service: CountriesService;

  const mockCountry = { id: 1, nameRu: 'США', nameEn: 'USA' };
  const mockCountriesService = {
    getAllCountries: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        {
          provide: CountriesService,
          useValue: mockCountriesService,
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);
    service = module.get<CountriesService>(CountriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of countries', async () => {
      mockCountriesService.getAllCountries.mockResolvedValue(mockCountry);
      expect(await controller.getAllCountries()).toEqual(mockCountry);
      expect(service.getAllCountries).toHaveBeenCalledTimes(1);
    });
  });
});
