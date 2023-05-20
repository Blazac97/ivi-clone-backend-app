import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ProfessionsService } from './professions.service';
import { Profession } from './professions.model';

describe('ProfessionsService', () => {
  let service: ProfessionsService;

  const mockProfessionArray = [{ id: 1, name: 'Актёры' },{ id: 2, name: 'Режисёры' }];

  const mockProfessionsRepository = {
    findAll: jest.fn().mockResolvedValue(mockProfessionArray),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessionsService,
        {
          provide: getModelToken(Profession),
          useValue: mockProfessionsRepository,
        },
      ],
    }).compile();

    service = module.get<ProfessionsService>(ProfessionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllProfessions', () => {
    it('should return an array of professions', async () => {
      mockProfessionsRepository.findAll.mockResolvedValue(mockProfessionArray);

      expect(await service.getAllProfessions()).toEqual(mockProfessionArray);
      expect(mockProfessionsRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('searchProfession', () => {
    it('should return an array of professions that match the professions names', async () => {
      const professionName = ['Актёры'];

      const result = await service.findProfessionByName(professionName);

      expect(mockProfessionsRepository.findAll).toHaveBeenCalledWith({
        where: {
          name:professionName,
        },
      });
      expect(result).toEqual(mockProfessionArray);
    });
  });
});
