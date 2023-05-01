import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Profession } from "../professions/professions.model";
import { Person } from "./persons.model";
import { FactDTO } from "../facts/dto/factDTO";
import { PersonDTO } from "./dto/personDTO";
import { GenreDTO } from "../genres/dto/genreDTO";
import { Genre } from "../genres/genres.model";
import { ProfessionsService } from "../professions/professions.service";
import { ProfessionDTO } from "../professions/dto/professionDTO";
import { Country } from "../countries/countries.model";
import { Film } from "../films/films.model";
import { Op } from "sequelize";

@Injectable()
export class PersonsService {

  constructor(@InjectModel(Person) private personRepository: typeof Person,
              private professionService: ProfessionsService) {
  }

  async getPersonById(id:number){
    const person = await this.personRepository.findByPk(id,{
      include:{all:true}
    });
    if (!person) {
      return null;
    }
    return person;
  }

  async findPersonByNameRU(personsNames: string[]){
    const people = await this.personRepository.findAll({
      where: {
        [Op.or]: [
          { nameRu: personsNames },
          { nameEn: personsNames }
        ]
      },
    });
    return people;
  }

  async createPerson(dto:PersonDTO){
    const person = await this.personRepository.create({...dto})
    const professionsNames = dto.professions.map((p: ProfessionDTO) => p.name);
    const professions = await this.professionService.findProfessionByName(professionsNames);
    if (professions.includes(null)) {
      throw new Error('One or more genre names could not be found');
    }
    const professionIds = professions.map((p: Profession) => p.id);
    await person.$set('professions', professionIds);
    person.professions = professions;
    return person;
  }

  async createPersons(dtos: PersonDTO[]){
    const professionsNames = dtos.flatMap((p: PersonDTO) => p.professions.map((pr: ProfessionDTO) => pr.name));
    const professions = await this.professionService.findProfessionByName(professionsNames);
    if (professions.includes(null)) {
      throw new Error('One or more genre names could not be found');
    }
    const professionIds = professions.map((p: Profession) => p.id);
    const persons = dtos.map(dto => ({...dto}));
    const createdPersons = await this.personRepository.bulkCreate(persons);
    await Promise.all(createdPersons.map(async (person: Person) => {
      await person.$set('professions', professionIds);
    }));
    return createdPersons;
  }

}
