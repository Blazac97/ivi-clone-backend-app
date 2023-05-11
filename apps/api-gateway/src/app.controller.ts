import {Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes} from "@nestjs/common";
import { AppService } from "./app.service";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { AuthDto } from "./dto/auth.dto";
import { ValidationPipe } from "./pipes/validation.pipe";
import { FilmDTO } from "./dto/filmDTO";
import { PersonDTO } from "./dto/personDTO";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {CommentDTO} from "./dto/commentDTO";
import {CreateRoleDto} from "./dto/createRoleDTO";

@Controller()
export class AppController {

  private clientUsers: ClientProxy;
  private clientData: ClientProxy;

  constructor(private readonly appService: AppService) {
    this.clientUsers = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://rabbitmq:5672"],
        queue: "users_queue",
        queueOptions: {
          durable: false
        }
      }
    });
    this.clientData = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://rabbitmq:5672"],
        queue: "films_queue",
        queueOptions: {
          durable: false
        }
      }
    });
  }

  async onModuleInit() {
    await this.clientUsers.connect();
    await this.clientData.connect();
  }

  @UsePipes(ValidationPipe)
  @Post("/createRole")
  async createRole(@Body() dto: CreateRoleDto) {
    const role = await this.clientUsers.send("createRole", dto).toPromise();
    return role;
  }


  @UsePipes(ValidationPipe)
  @Post("/registration")
  async registrationUser(@Body() dto: AuthDto) {
    const user = await this.clientUsers.send("registration", dto).toPromise();
    return user;
  }

  @UsePipes(ValidationPipe)
  @Post("/login")
  async loginUser(@Body() dto: AuthDto) {
    const user = await this.clientUsers.send("login", dto).toPromise();

    return user;
  }


  @Get("/filters")
  async getAllGenres() {
    const genres = await this.clientData.send("getAll.genres", "").toPromise();
    const countries = await this.clientData.send("getAll.countries", "").toPromise();
    const years = await this.clientData.send("getAllFilmYears", "").toPromise();
    const genreDto = genres.map((genre) => {
      return { nameRu: genre.nameRu, nameEn: genre.nameEn };
    });

    const countryDto = countries.map((country) => {
      return { countryName: country.countryName };
    });

    return {
      genres: genreDto,
      countries: countryDto,
      years
    };
  }


  @Get("/professions")
  async getAllProfessions() {
    const professions = await this.clientData.send("getAll.professions", "").toPromise();

    return professions;

  }

  @Get("/person/:id")
  async getPersonById(@Param("id") id: number) {
    const person = await this.clientData.send("getPersonById", id).toPromise();

    return person;

  }

  @Post("/person")
  async createPersons(@Body() dto: PersonDTO[]) {
    const persons = await this.clientData.send("createPersons", dto).toPromise();

    return persons;
  }

  @Get("/fact/:id")
  async getFactById(@Param("id") id: number) {
    const fact = await this.clientData.send("getFactById", id).toPromise();

    return fact;

  }


  
  @Get("/film/:id")
  async getFilmById(@Param("id") id: number) {
    const film = await this.clientData.send("getFilmById", id).toPromise();
    return film;
  }


  @Post("/film")
  async createFilm(@Body() dto: FilmDTO) {
    const film = await this.clientData.send("createFilm", dto).toPromise();

    return film;
  }

  @Patch("/film/:id")
  async updateFilm(@Param("id") id: number, @Body() dto: FilmDTO) {
    const film = await this.clientData.send("updateFilm", { id, dto }).toPromise();

    return film;
  }

  @Get("/films")
  async filters(@Query("page") page: number,
                @Query("perPage") perPage: number,
                @Query("genres") genres?: string[],
                @Query("countries") countries?: string[],
                @Query("persons") persons?: string[],
                @Query("minRatingKp") minRatingKp?: number,
                @Query("minVotesKp") minVotesKp?: number,
                @Query("sortBy") sortBy?: string,) {
    const films = await this.clientData.send("filters", {
      page, perPage,
      genres, countries,
      persons, minRatingKp,
      minVotesKp, sortBy
    }).toPromise();

    return films;
  }

  @UseGuards(JwtAuthGuard)
  @Post("/:filmId")
  async createComment(@Param("filmId") filmId: number, @Body() dto: CommentDTO, @Req() req) {
    const userId = req.user.id;
    const parentId = req.user.id;
    const comment = await this.clientData.send("createComment", { filmId, dto, userId, parentId }).toPromise();
    return comment;
  }

}
