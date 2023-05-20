import { Test, TestingModule } from '@nestjs/testing';
import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './professions.service';

describe('ProfessionsController', () => {
  let controller: ProfessionsController;
  let service: ProfessionsService;

  const mockProfessionArray = [{ id: 1, name: 'Актёры' },{ id: 2, name: 'Режисёры' }];
  const mockProfessionsService = {
    getAllProfessions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessionsController],
      providers: [
        {
          provide: ProfessionsService,
          useValue: mockProfessionsService,
        },
      ],
    }).compile();

    controller = module.get<ProfessionsController>(ProfessionsController);
    service = module.get<ProfessionsService>(ProfessionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll.professions', () => {
    it('should return an array of professions', async () => {
      mockProfessionsService.getAllProfessions.mockResolvedValue(mockProfessionArray);
      expect(await controller.getAllProfessions()).toEqual(mockProfessionArray);
      expect(service.getAllProfessions).toHaveBeenCalledTimes(1);
    });
  });
});