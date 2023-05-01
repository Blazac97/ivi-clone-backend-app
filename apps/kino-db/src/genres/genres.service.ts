import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Genre } from "./genres.model";
import { Country } from "../countries/countries.model";
import { Op } from "sequelize";
import { GenreDTO } from "./dto/genreDTO";

@Injectable()
export class GenresService {

  constructor(@InjectModel(Genre) private genreRepository: typeof Genre) {
  }

  async getAllGenres() {
    const genres = await this.genreRepository.findAll({ include: { all: true } });
    return genres;
  }

  async findGenreByNameRU(genreNames: string[]) {
    const genres = await this.genreRepository.findAll({
      where: {
        [Op.or]: [
          { nameRu: genreNames },
          { nameEn: genreNames }
        ]
      }
    });
    return genres;
  }

  async createGenre(dto: GenreDTO) {
    const genre = await this.genreRepository.create(dto);
    return genre;
  }

  async updateGenre(id: number, dto: GenreDTO) {
    const genre = await this.genreRepository.update({ ...dto }, { where: { id: id } });
    return genre;
  }

  async deleteGenre(id: number) {
    await this.genreRepository.destroy({ where: { id: id } });
  }
}
