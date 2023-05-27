import {  Controller, Get, Param,} from "@nestjs/common";
import { RolesService } from './roles.service';
import { CreateRoleDto } from "./dto/createRoleDto";
import {MessagePattern, Payload} from "@nestjs/microservices";

@Controller('roles')
export class RolesController {

  constructor(private roleService: RolesService) {}




  @MessagePattern('createRole')
  async registration(@Payload() dto: CreateRoleDto) {
    return  await this.roleService.createRole(dto);
  }


  @Get('/:value')
  getByValue(@Param('value') value:string){
    return this.roleService.getRoleByValue(value);
  }
}
