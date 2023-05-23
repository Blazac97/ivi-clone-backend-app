import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseFilters,
    UseGuards,
    UsePipes
} from "@nestjs/common";
import {AppService} from "./app.service";
import {ClientProxy, ClientProxyFactory, Transport} from "@nestjs/microservices";
import {AuthDto} from "./dto/auth.dto";
import {ValidationPipe} from "./pipes/validation.pipe";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {CommentDTO} from "./dto/commentDTO";
import {GenreDTO} from "./dto/genreDTO";
import {CreateUserDto} from "../../auth-users/src/users/dto/createUserDto";
import {OauthCreateUserDTO} from "./dto/oauthCreateUserDTO";
import {UpdateFilmDTO} from "./dto/updateFilmDTO";
import {HttpExceptionFilter} from "./exceptions/httpExceptionFilter";

@UseFilters(new HttpExceptionFilter())
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
    async registrationUser(@Body() dto: CreateUserDto) {
        const data = await this.clientUsers.send("registration", dto).toPromise();
        return {User: data.user, role: data.user.roles, token: data.token};
    }


    @UsePipes(ValidationPipe)
    @Post("/outRegistration")
    async outRegistrationUser(@Body() dto: OauthCreateUserDTO) {
        const data = await this.clientUsers.send("outRegistration", dto).toPromise();
        return {User: data.user, token: data.token};
    }


    @UsePipes(ValidationPipe)
    @Post("/login")
    async loginUser(@Body() dto: AuthDto) {
        const data = await this.clientUsers.send("login", dto).toPromise();
        return {email: data.user.email, userId: data.user.id, role: data.user.roles ,token: data.token};
    }


    @Get("/filters")
    async filters() {
        const genres = await this.clientData.send("getAll.genres", "").toPromise();
        const countries = await this.clientData.send("getAll.countries", "").toPromise();
        const years = await this.clientData.send("getAllFilmYears", "").toPromise();
        const genreDto = genres.map((genre) => {
            return {nameRu: genre.nameRu, nameEn: genre.nameEn};
        });

        const countryDto = countries.map((country) => {
            return {countryName: country.countryName, countryNameEn: country.countryNameEn};
        });

        return {
            genres: genreDto,
            countries: countryDto,
            years
        };
    }


    @Get("/person/:id")
    async getPersonById(@Param("id") id: number) {
        const person = await this.clientData.send("getPersonById", id).toPromise();

        return person;

    }


    @Get("/film/:id")
    async getFilmById(@Param("id") id: number) {
        const film = await this.clientData.send("getFilmById", id).toPromise();
        return film;
    }

    @Get("/comments/:id")
    async getCommentsByFilmId(@Param("id") id: number) {
        const comments = await this.clientData.send("getCommentsByFilmId", id).toPromise();
        return comments;
    }


    @Patch("/film/:id")
    async updateFilm(@Param("id") id: number, @Body() dto: UpdateFilmDTO) {
        const film = await this.clientData.send("updateFilm", {id, dto}).toPromise();

        return film;
    }


    @Delete("/film/:id")
    async deleteFilmById(@Param("id") id: number) {
        const response = await this.clientData.send("deleteFilmById", id).toPromise();

        return response;
    }


    @Patch("/genre/:id")
    async updateGenre(@Param("id") id: number, @Body() dto: GenreDTO) {
        const genre = await this.clientData.send("updateGenre", {id, dto}).toPromise();

        return genre;
    }


    @Get("/genres")
    async getAllGenres() {
        const genres = await this.clientData.send("getAll.genres", "").toPromise();
        return genres.map((genre) => {
            return {id: genre.id, nameRu: genre.nameRu, nameEn: genre.nameEn};
        })
    }


    @Get("/films")
    async films(@Query("page") page: number,
                  @Query("perPage") perPage: number,
                  @Query("genres") genres?: string[],
                  @Query("countries") countries?: string[],
                  @Query("persons") persons?: string[],
                  @Query("minRatingKp") minRatingKp?: number,
                  @Query("minVotesKp") minVotesKp?: number,
                  @Query("sortBy") sortBy?: string,
                  @Query("year") year?: number,) {
        const films = await this.clientData.send("filters", {
            page, perPage,
            genres, countries,
            persons, minRatingKp,
            minVotesKp, sortBy, year
        }).toPromise();

        return films;
    }


    @UseGuards(JwtAuthGuard)
    @Post("/:filmId")
    async createComment(@Param("filmId") filmId: number, @Body() dto: CommentDTO, @Req() req) {
        const userId = req.user.id;
        const comment = await this.clientData.send("createComment", {filmId, dto, userId}).toPromise();
        return comment;
    }


    @Get("/search")
    async search(@Query("name") name?: string) {

        const films = await this.clientData.send("searchFilmsByName", name).toPromise();
        const people = await this.clientData.send("searchPersonsByName", name).toPromise();
        const genres = await this.clientData.send("searchGenresByName", name).toPromise();

        const filmDto = films.map((film) => {
            return {id: film.id, nameRu: film.filmNameRu, nameEn: film.filmNameEn};
        });

        const peopleDto = people.map((person) => {
            return {id: person.id, nameRu: person.nameRu, nameEn: person.nameEn};
        });

        const genreDto = genres.map((genre) => {
            return {id: genre.id, nameRu: genre.nameRu, nameEn: genre.nameEn};
        });

        return {
            films: filmDto,
            people: peopleDto,
            genres: genreDto
        };
    }

    @Get("/findPersonsByNameAndProfession")
    async findPersonsByNameAndProfession(@Query("name") name?: string, @Query("id") id?: number) {
        const people = await this.clientData.send("findPersonsByNameAndProfession", {name, id}).toPromise();
        return people;
    }

    @UseGuards(JwtAuthGuard)
    @Get("/checkToken")
    async checkToken(@Req() req) {
        const user = req.user;
        return user;
    }
}
