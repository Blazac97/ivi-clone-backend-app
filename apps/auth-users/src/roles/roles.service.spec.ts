import { Test, TestingModule } from '@nestjs/testing';
import { Op } from 'sequelize';
import { getModelToken } from '@nestjs/sequelize';
import { RolesService } from './roles.service';
import { Role } from './roles.model';

describe('RolesService', () => {
  let service: RolesService;

  const mockRole = { id: 1, value: 'ADMIN' };
  const mockRoleDto = { value: 'ADMIN' };

  const mockRolesRepository = {
    findOne: jest.fn(),
    create: jest.fn().mockResolvedValue(mockRole),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getModelToken(Role),
          useValue: mockRolesRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRoleByValue', () => {
    it('should return role', async () => {
      mockRolesRepository.findOne.mockResolvedValue(mockRole);
      const roleValue = 'ADMIN';
      expect(await service.getRoleByValue(roleValue)).toEqual(mockRole);
      expect(mockRolesRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('createRole', () => {
    it('should create role', async () => {
      expect(await service.createRole(mockRoleDto)).toEqual(mockRole);
      expect(mockRolesRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});
