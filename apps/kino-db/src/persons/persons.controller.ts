import {Controller} from '@nestjs/common';
import {MessagePattern, Payload} from "@nestjs/microservices";
import {PersonsService} from "./persons.service";

@Controller('persons')
export class PersonsController {

    constructor(private readonly personsService: PersonsService,
    ) {
    }

    @MessagePattern('getPersonById')
    async getPersonById(@Payload() id: number) {
        return await this.personsService.getPersonById(id);
    }

    @MessagePattern("searchPersonsByName")
    async searchPersonsByName(@Payload() name: string) {
        return await this.personsService.searchPersonsByName(name);
    }

    @MessagePattern("findPersonsByNameAndProfession")
    async findPersonsByNameAndProfession(@Payload() data: {
        id: number, name: string
    }) {
        const {
            id, name
        } = data;
        return await this.personsService.findPersonsByNameAndProfession(name, id);
    }
}
