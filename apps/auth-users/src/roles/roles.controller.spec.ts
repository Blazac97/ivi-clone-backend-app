import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  const mockRole = { id: 1, value: 'ADMIN' };
  const mockRoleDto = { value: 'ADMIN' };

  const mockRolesService = {
    createRole: jest.fn().mockResolvedValue(mockRole),
    getRoleByValue: jest.fn().mockResolvedValue(mockRole),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registration', () => {
    it('should create role', async () => {
      expect(await controller.registration(mockRoleDto)).toEqual(mockRole);
      expect(mockRolesService.createRole).toHaveBeenCalledTimes(1);
    });
  });

  describe('getByValue', () => {
    it('should get role by value', async () => {
      const roleValue = 'ADMIN';
      expect(await controller.getByValue(roleValue)).toEqual(mockRole);
      expect(mockRolesService.getRoleByValue).toHaveBeenCalledTimes(1);
    });
  });
});
