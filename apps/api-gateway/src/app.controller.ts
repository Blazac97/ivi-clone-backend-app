import { Body, Controller, Get, Param, Patch, Post, Query, UsePipes } from "@nestjs/common";
import { AppService } from "./app.service";
import { ClientProxy, ClientProxyFactory, Transport } from "@nestjs/microservices";
import { AuthDto } from "./dto/auth.dto";
import { ValidationPipe } from "./pipes/validation.pipe";
import { FilmDTO } from "./dto/filmDTO";
import { PersonDTO } from "./dto/personDTO";

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


  @Get("/genres")
  async getAllGenres() {
    const genre = await this.clientData.send("getAll.genres", "").toPromise();

    return genre;
  }

  @Get("/countries")
  async getAllCountries() {
    const country = await this.clientData.send("getAll.countries", "").toPromise();

    return country;
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

 @Get("/films")
  async getFilms() {
    const film = await this.clientData.send("getAllFilms", "").toPromise();
    return film;
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

  @Get("/filters")
  async filters(@Query("genres") genres?: string[],
                @Query("countries") countries?: string[],
                @Query("persons") persons?: string[],
                @Query("minRatingKp") minRatingKp?: number,
                @Query("minVotesKp") minVotesKp?: number) {
    const films = await this.clientData.send("filters", {
      genres, countries,
      persons, minRatingKp, minVotesKp
    }).toPromise();

    return films;
  }

}
