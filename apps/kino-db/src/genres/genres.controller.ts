import { Controller } from '@nestjs/common';
import { GenresService } from "./genres.service";
import { MessagePattern } from "@nestjs/microservices";

@Controller('genres')
export class GenresController {

  constructor(private readonly genresService: GenresService,
  ) {}

  @MessagePattern('getAll.genres')
  async getAllGenres() {
    return  await this.genresService.getAllGenres();
  }
}
