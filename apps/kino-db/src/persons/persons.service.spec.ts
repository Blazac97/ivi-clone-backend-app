import { Test, TestingModule } from '@nestjs/testing';
import { Op } from 'sequelize';
import { getModelToken } from '@nestjs/sequelize';
import { PersonsService } from './persons.service';
import { Person } from './persons.model';
import { ProfessionsService } from '../professions/professions.service';
import { Profession } from '../professions/professions.model';

describe('PersonsService', () => {
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

  const mockPersonsRepository = {
    findByPk: jest.fn().mockResolvedValue(mockPerson),
    findAll: jest.fn().mockResolvedValue(mockPersonsArray),
    create: jest.fn().mockResolvedValue(mockPerson),
  };
  const mockProfessinsService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonsService,
        {
          provide: getModelToken(Person),
          useValue: mockPersonsRepository,
        },
        ProfessionsService,
      ],
    })
      .overrideProvider(ProfessionsService)
      .useValue(mockProfessinsService)
      .compile();

    service = module.get<PersonsService>(PersonsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPersonById', () => {
    it('should return person', async () => {
      mockPersonsRepository.findByPk.mockResolvedValue(mockPerson);

      expect(await service.getPersonById(mockPerson.id)).toEqual(mockPerson);
      expect(mockPersonsRepository.findByPk).toHaveBeenCalledTimes(1);
    });
  });

  describe('findPersonsByNameAndProfession', () => {
    it('should return array of persons', async () => {
      let personName = 'Джон';
      let professionId = 1;
      expect(
        await service.findPersonsByNameAndProfession(personName, professionId),
      ).toEqual(mockPersonsArray);
      expect(mockPersonsRepository.findAll).toHaveBeenCalledWith({
        include: {
          model: Profession,
          where: { id: professionId },
          through: { attributes: [] },
        },
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                { nameRu: { [Op.iLike]: `%${personName}%` } },
                { nameEn: { [Op.iLike]: `%${personName}%` } },
              ],
            },
          ],
        },
        limit: 10,
      });
      expect(mockPersonsRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('searchPersonsByName', () => {
    it('should return array of persons', async () => {
      let personName = 'Джон';
      expect(await service.searchPersonsByName(personName)).toEqual(
        mockPersonsArray,
      );
      expect(mockPersonsRepository.findAll).toHaveBeenCalledWith({
        where: {
          [Op.or]: [
            { nameRu: { [Op.iLike]: `%${personName}%` } },
            { nameEn: { [Op.iLike]: `%${personName}%` } },
          ],
        },
        limit: 10,
      });
      expect(mockPersonsRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
