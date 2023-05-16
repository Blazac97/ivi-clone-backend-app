import {forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {User} from './users.model';
import {RolesService} from "../roles/roles.service";
import {AddRoleDto} from "./dto/addRoleDto";
import {CreateUserDto} from "./dto/createUserDto";
import * as bcrypt from 'bcryptjs';
import {AuthDto} from "./dto/auth.dto";
import {JwtService} from "@nestjs/jwt";
import {OauthCreateUserDTO} from "./dto/oauthCreateUserDTO";

@Injectable()
export class UsersService {

    constructor(@InjectModel(User) private userRepository: typeof User,
                private roleService: RolesService, private jwtService: JwtService) {
    }

    async login(dto: AuthDto) {
        const user = await this.validateUser(dto)
        const token = await this.generateToken(user)
        return {user, token};
    }
    async createUser(dto: CreateUserDto) {
        return this.createUserWithRole(dto, "ADMIN");
    }

    async oauthCreateUser(dto: OauthCreateUserDTO) {
        return this.createUserWithRole(dto, "ADMIN");
    }

    private async createUserWithRole(dto: CreateUserDto | OauthCreateUserDTO, roleName: string) {
        const candidate = await this.userRepository.findOne({
            where: { email: dto.email },
            include: { all: true },
        });
        if (candidate) {
            throw new HttpException(
                'Пользователь с таким email уже зарегистрирован',
                HttpStatus.BAD_REQUEST
            );
        }
        const hashPassword = await bcrypt.hash(
            'password' in dto ? dto.password : 'SECRET_PASSWORD',
            5
        );
        const user = await this.userRepository.create({
            ...dto,
            password: hashPassword,
        });
        const role = await this.roleService.getRoleByValue(roleName);
        await user.$set('roles', [role.id]);
        user.roles = [role];
        const token = await this.generateToken(user);
        return { user, token };
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email}, include: {all: true}});
        return user;
    }


    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (role && user) {
            await user.$add('role', role.id);
            return dto;
        }
        throw new HttpException('Пользователь или роль не найдены', HttpStatus.NOT_FOUND);
    }

    async validateUser(dto: AuthDto) {
        try {
            const user = await this.userRepository.findOne({where: {email: dto.email}, include: {all: true}});
            const passwordEquals = await bcrypt.compare(dto.password, user.password);
            if (user && passwordEquals) {
                return user;
            }
        } catch (e) {
            throw new UnauthorizedException({message: 'Некорректный email или пароль'})
        }

    }

    async generateToken(user: User) {
        const payload = {email: user.email, id: user.id, roles: user.roles};
        const options = {secret: 'SECRET'};
        return {
            token: await this.jwtService.signAsync(payload, options),
        };
    }


}
