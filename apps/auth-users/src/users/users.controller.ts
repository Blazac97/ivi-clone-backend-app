import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateUserDto } from "./dto/createUserDto";
import { UsersService } from "./users.service";
import { AuthDto } from "./dto/auth.dto";


@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService,
  ) {}


  @MessagePattern('registration')
  async registration(@Payload() dto: CreateUserDto) {
    console.log(dto)
    return  await this.usersService.createUser(dto);
  }

  @MessagePattern('login')
  async login(@Payload() dto: AuthDto) {
    console.log(dto)
    return  await this.usersService.login(dto);
  }


}
