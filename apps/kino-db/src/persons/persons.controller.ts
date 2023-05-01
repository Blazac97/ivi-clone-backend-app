import { Controller } from '@nestjs/common';
import { ProfessionsService } from "../professions/professions.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PersonsService } from "./persons.service";
import { PersonDTO } from "./dto/personDTO";

@Controller('persons')
export class PersonsController {

  constructor(private readonly personsService: PersonsService,
  ) {}

  @MessagePattern('getPersonById')
  async getPersonById(@Payload() id: number) {
    return  await this.personsService.getPersonById(id);
  }

  @MessagePattern('createPersons')
  async createPersons(@Payload() dtos: PersonDTO[]) {
    return  await this.personsService.createPersons(dtos);
  }
}
