import { forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from './users.model';
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/addRoleDto";
import { CreateUserDto } from "./dto/createUserDto";
import * as bcrypt from 'bcryptjs';
import { AuthDto } from "./dto/auth.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {

  constructor(@InjectModel(User) private userRepository: typeof User,
              private roleService: RolesService,private jwtService: JwtService) {
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto)
    return this.generateToken(user)
  }

  async createUser(dto: CreateUserDto) {
    const candidate = await this.userRepository.findOne({where:{email: dto.email}, include:{all:true}});
    if (candidate) {
      throw new HttpException('Пользователь с таким email уже зарегестрирован', HttpStatus.BAD_REQUEST)
    }
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userRepository.create({...dto, password: hashPassword});
    const role = await this.roleService.getRoleByValue("ADMIN");
    await user.$set('roles', [role.id]);
    user.roles = [role]
    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({include:{all:true}});
    return users;
  }

  async getUserByEmail(email:string){
    const user = await this.userRepository.findOne({where:{email}, include:{all:true}});
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
      const user = await this.userRepository.findOne({where:{email: dto.email}, include:{all:true}});
      const passwordEquals = await bcrypt.compare(dto.password, user.password);
      if (user && passwordEquals) {
        return user;
      }
    }catch (e){
      throw new UnauthorizedException({message: 'Некорректный email или пароль'})
    }

  }

  async generateToken(user: User) {
    const payload = {email: user.email, id: user.id, roles: user.roles}
    return {
      token: this.jwtService.sign(payload)
    }
  }


}
