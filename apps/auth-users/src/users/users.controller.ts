import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateUserDto } from "./dto/createUserDto";
import { UsersService } from "./users.service";
import { AuthDto } from "./dto/auth.dto";
import {OauthCreateUserDTO} from "./dto/oauthCreateUserDTO";


@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService,
  ) {}

  @MessagePattern('registration')
  async registration(@Payload() dto: CreateUserDto) {
    return  await this.usersService.createUser(dto);
  }

  @MessagePattern('outRegistration')
  async outRegistration(@Payload() dto: OauthCreateUserDTO) {
    return  await this.usersService.oauthCreateUser(dto);
  }

  @MessagePattern('login')
  async login(@Payload() dto: AuthDto) {
    return  await this.usersService.login(dto);
  }


}
