import {UsersService} from "./users.service";
import {Test, TestingModule} from "@nestjs/testing";
import {getModelToken} from "@nestjs/sequelize";
import {User} from "./users.model";
import {RolesService} from "../roles/roles.service";
import {JwtService} from "@nestjs/jwt";
import {HttpException, HttpStatus, UnauthorizedException} from "@nestjs/common";
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('UsersService', () => {
    let service: UsersService;

    const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        createdAt: new Date('2023-05-10T16:34:56.833Z'),
        updatedAt: new Date('2023-05-10T16:34:56.833Z'),
        roles: [],
    };


    const mockOauthUserDTO = {
        email: 'test@example.com',
    };

    const mockUserDTO = {
        email: 'test@example.com',
        password: 'password',
    };

    const mockAuthDto = {
        email: 'test@example.com',
        password: 'password',
    };

    const mockRole = {id: 1, value: 'ADMIN'};
    const mockAddRoleDto = {value: 'ADMIN', userId: 1};

    const mockUsersRepository = {
        create: jest.fn().mockResolvedValue(mockUser),
        getAllUsers: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn().mockResolvedValue(mockUser),
        findByPk: jest.fn().mockResolvedValue(mockUser.id),
        update: jest.fn().mockResolvedValue(mockUser.id).mockResolvedValue(mockUserDTO),
        destroy: jest.fn().mockResolvedValue(mockUser.id),
    };

    const mockRolesService = {
        getRoleByValue: jest.fn().mockResolvedValue(mockRole),
    };

    const mockJwtService = {
        signAsync: jest.fn().mockReturnValue('mocked-token'),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService, {
                    provide: getModelToken(User),
                    useValue: mockUsersRepository
                },
                RolesService,
                JwtService
            ],
        }).overrideProvider(RolesService).useValue(mockRolesService)
            .overrideProvider(JwtService).useValue(mockJwtService).compile();

        service = module.get<UsersService>(UsersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateToken', () => {
        it('should generate a token for the user', async () => {

            const result = await service.generateToken(mockUser as User);

            expect(mockJwtService.signAsync).toHaveBeenCalledWith(
                {
                    email: mockUser.email,
                    id: mockUser.id,
                    roles: mockUser.roles,
                },
                { secret: 'SECRET' }
            );
            expect(result).toEqual({ token: 'mocked-token' });
        });
    });

    describe('validateUser', () => {
        it('should return the user if email and password are correct', async () => {
            jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

            const result = await service.validateUser(mockAuthDto);

            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ where: { email: mockAuthDto.email }, include: { all: true } });
            expect(bcrypt.compare).toHaveBeenCalledWith(mockAuthDto.password, mockUser.password);
            expect(result).toEqual(mockUser);
        });

        it('should throw UnauthorizedException if email or password is incorrect', async () => {
            jest.spyOn(mockUsersRepository, 'findOne').mockResolvedValue(null);

            await expect(service.validateUser(mockAuthDto)).rejects.toThrow(UnauthorizedException);
            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ where: { email: mockAuthDto.email }, include: { all: true } });
        });
    });

    describe('login', () => {
        it('should return user and token if login is successful', async () => {
            jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser as User);
            jest.spyOn(service, 'generateToken').mockResolvedValue({ token: 'your-token-value' });

            const result = await service.login(mockAuthDto);

            expect(service.validateUser).toHaveBeenCalledWith(mockAuthDto);
            expect(service.generateToken).toHaveBeenCalledWith(mockUser);
            expect(result).toEqual({ user: mockUser, token: {token: 'your-token-value' }});
        });

        it('should throw UnauthorizedException if login is unsuccessful', async () => {
            jest.spyOn(service, 'validateUser').mockRejectedValue(new UnauthorizedException());
            jest.spyOn(service, 'generateToken');

            await expect(service.login(mockAuthDto)).rejects.toThrow(UnauthorizedException);
            expect(service.validateUser).toHaveBeenCalledWith(mockAuthDto);
            expect(service.generateToken).not.toHaveBeenCalled();
        });
    });

    describe('createUser', () => {
        it('should create a new user with "ADMIN" role if no user with the same email exists', async () => {
            mockUsersRepository.findOne.mockResolvedValue(null);
            jest.spyOn(service, 'createUserWithRole').mockResolvedValue({
                user: mockUser as User,
                token: {token: 'your-token-value'},
            });

            const result = await service.createUser(mockUserDTO);

            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: { email: mockUserDTO.email },
                include: { all: true },
            });
            expect(service.createUserWithRole).toHaveBeenCalledWith(
                mockUserDTO,
                'ADMIN'
            );
            expect(result).toEqual({
                user: mockUser,
                token: {token: 'your-token-value'},
            });
        });

        it('should throw an HttpException if a user with the same email already exists', async () => {
            mockUsersRepository.findOne.mockResolvedValue(mockUser);
            jest.spyOn(service, 'createUserWithRole');

            await expect(service.createUser(mockUserDTO)).rejects.toThrowError(
                new HttpException(
                    'Пользователь с таким email уже зарегистрирован',
                    HttpStatus.BAD_REQUEST
                )
            );

            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: { email: mockUserDTO.email },
                include: { all: true },
            });
            expect(service.createUserWithRole).not.toHaveBeenCalled();
        });
    });

    describe('oauthCreateUser', () => {
        it('should create a new user with "ADMIN" role if no user with the same email exists', async () => {
            mockUsersRepository.findOne.mockResolvedValue(null);
            jest.spyOn(service, 'createUserWithRole').mockResolvedValue({
                user: mockUser as User,
                token: {token: 'your-token-value'},
            });

            const result = await service.oauthCreateUser(mockOauthUserDTO);

            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: { email: mockOauthUserDTO.email },
                include: { all: true },
            });
            expect(service.createUserWithRole).toHaveBeenCalledWith(
                mockOauthUserDTO,
                'ADMIN'
            );
            expect(result).toEqual({
                user: mockUser,
                token: {token: 'your-token-value'},
            });
        });

        it('should login the user if a user with the same email already exists', async () => {
            mockUsersRepository.findOne.mockResolvedValue(mockUser);
            jest.spyOn(service, 'login').mockResolvedValue({
                user: mockUser as User,
                token: {token: 'your-token-value'},
            });
            jest.spyOn(service, 'createUserWithRole');

            const result = await service.oauthCreateUser(mockOauthUserDTO);

            expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
                where: { email: mockOauthUserDTO.email },
                include: { all: true },
            });
            expect(service.login).toHaveBeenCalledWith({
                email: mockOauthUserDTO.email,
                password: 'SECRET_PASSWORD',
            });
            expect(service.createUserWithRole).not.toHaveBeenCalled();
            expect(result).toEqual({
                user: mockUser,
                token: {token: 'your-token-value'},
            });
        });
    });
});
