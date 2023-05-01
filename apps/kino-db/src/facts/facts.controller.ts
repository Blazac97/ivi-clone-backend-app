import { Controller } from '@nestjs/common';
import { PersonsService } from "../persons/persons.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { FactsService } from "./facts.service";

@Controller('facts')
export class FactsController {

  constructor(private readonly factsService: FactsService,
  ) {}

  @MessagePattern('getFactById')
  async getFactById(@Payload() id: number) {
    return  await this.factsService.getFactById(id);
  }
}
