import {Controller, HttpStatus} from '@nestjs/common';
import { GenresService } from "./genres.service";
import {MessagePattern, Payload} from "@nestjs/microservices";
import {FilmDTO} from "../films/dto/filmDTO";
import {GenreDTO} from "./dto/genreDTO";

@Controller('genres')
export class GenresController {

  constructor(private readonly genresService: GenresService,
  ) {}

  @MessagePattern('getAll.genres')
  async getAllGenres() {
    return  await this.genresService.getAllGenres();
  }

  @MessagePattern("searchGenresByName")
  async searchGenresByName(@Payload() name: string) {
    return await this.genresService.searchGenresByName(name);
  }

  @MessagePattern('updateGenre')
  async updateGenre(@Payload() data: { id: number, dto: GenreDTO }) {
    const { id, dto } = data;
    return  await this.genresService.updateGenre(id,dto);
  }

  @MessagePattern('deleteGenre')
  async deleteGenre(@Payload() id: number) {
    await this.genresService.deleteGenre(id);
    return HttpStatus.OK;
  }
}
