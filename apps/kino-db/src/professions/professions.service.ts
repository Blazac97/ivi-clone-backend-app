import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Country } from "../countries/countries.model";
import { Profession } from "./professions.model";

@Injectable()
export class ProfessionsService {

  constructor(@InjectModel(Profession) private professionRepository: typeof Profession) {
  }

  async getAllProfessions() {
    const professions = await this.professionRepository.findAll({ include: { all: true } });
    return professions;
  }

  async findProfessionByName(professionsNames: string[]){
    const professions = await this.professionRepository.findAll({
      where: {
        name: professionsNames,
      },
    });
    return professions;
  }
}
