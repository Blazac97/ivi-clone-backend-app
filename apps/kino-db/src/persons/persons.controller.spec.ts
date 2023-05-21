import { Test, TestingModule } from '@nestjs/testing';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';

describe('PersonsController', () => {
  let controller: PersonsController;
  let service: PersonsService;

  
  const mockPerson = {
    id: 1,
    photoUrl: 'http://someUrl.com',
    nameRu: 'Джон Сина',
    nameEn: 'John Sean',
    professions: [1, 2, 3],
  };

  const mockPersonsArray = [
    {
      id: 1,
      photoUrl: 'http://someUrl.com',
      nameRu: 'Джон Сина',
      nameEn: 'John Sean',
      professions: [1, 2, 3],
    },
    {
      id: 2,
      photoUrl: 'http://someUrl2.com',
      nameRu: 'Джон Сильвер',
      nameEn: 'John Silver',
      professions: [1, 3],
    },
  ];

    const mockPersonsService = {
    getPersonById: jest.fn().mockResolvedValue(mockPerson),
    searchPersonsByName: jest.fn().mockResolvedValue(mockPersonsArray),
    findPersonsByNameAndProfession: jest.fn().mockResolvedValue(mockPersonsArray)
    }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonsController],
      providers: [
        {
          provide: PersonsService,
          useValue: mockPersonsService,
        },
      ],
    }).compile();

    controller = module.get<PersonsController>(PersonsController);
    service = module.get<PersonsService>(PersonsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPersonById', () => {
    it('should return person', async () => {
      let id = 1
      expect(await controller.getPersonById(id)).toEqual(mockPerson);
      expect(mockPersonsService.getPersonById).toHaveBeenCalledTimes(1);
    });
  });

  describe('searchPersonsByName', () => {
    it('should return persons', async () => {
      let name = "Джон";
      expect(await controller.searchPersonsByName(name)).toEqual(mockPersonsArray);
      expect(mockPersonsService.searchPersonsByName).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('findPersonsByNameAndProfession', () => {
    it('should return persons', async () => {
      let data = {
        id: 1,
        name: "Джон"
      }
      expect(await controller.findPersonsByNameAndProfession(data)).toEqual(mockPersonsArray);
      expect(mockPersonsService.findPersonsByNameAndProfession).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});