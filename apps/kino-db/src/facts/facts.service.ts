import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/sequelize";
import { Fact } from "./facts.model";
import { FactDTO } from "./dto/factDTO";


@Injectable()
export class FactsService {

  constructor(@InjectModel(Fact) private factRepository: typeof Fact) {
  }

  async getFactById(id:number){
    const fact = await this.factRepository.findByPk(id,{include:{all:true}});
    if (!fact) {
      return null;
    }
    return fact;
  }

  async createFact(dto:FactDTO, filmId:number){
    await this.factRepository.create({...dto, filmId})
  }

  async updateFact(dto:FactDTO, filmId:number){
    console.log(dto)
    await this.factRepository.update({...dto},{where:{filmId:filmId}})
  }


}
