import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, UsePipes} from "@nestjs/common";
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
import {ApiOperation, ApiResponse} from "@nestjs/swagger";
import {RolesGuard} from "./guards/roles.guard";
import {Roles} from "./guards/roles-auth.decorator";
import {User} from "../../auth-users/src/users/users.model";
import {Person} from "../../kino-db/src/persons/persons.model";
import {Comment} from "../../kino-db/src/comments/comments.model";
import {Film} from "../../kino-db/src/films/films.model";


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

    @ApiOperation({summary: 'Регистрация'})
    @ApiResponse({status: 200})
    @UsePipes(ValidationPipe)
    @Post("/registration")
    async registrationUser(@Body() dto: CreateUserDto) {
        const data = await this.clientUsers.send("registration", dto).toPromise();
        return {User: data.user, role: data.user.roles, token: data.token};
    }

    @ApiOperation({summary: 'Авторизация через сьторонние сайты'})
    @ApiResponse({status: 200})
    @UsePipes(ValidationPipe)
    @Post("/outRegistration")
    async outRegistrationUser(@Body() dto: OauthCreateUserDTO) {
        const data = await this.clientUsers.send("outRegistration", dto).toPromise();
        return {User: data.user, token: data.token};
    }


    @ApiOperation({summary: 'Логин'})
    @ApiResponse({status: 200})
    @UsePipes(ValidationPipe)
    @Post("/login")
    async loginUser(@Body() dto: AuthDto) {
        const data = await this.clientUsers.send("login", dto).toPromise();
        return {email: data.user.email, userId: data.user.id, role: data.user.roles, token: data.token};
    }

    @ApiOperation({summary: 'фильтры для поиска'})
    @ApiResponse({status: 200})
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

    @ApiOperation({summary: 'Получение персона по id'})
    @ApiResponse({status: 200, type: [Person]})
    @Get("/person/:id")
    async getPersonById(@Param("id") id: number) {
        const person = await this.clientData.send("getPersonById", id).toPromise();

        return person;

    }

    @ApiOperation({summary: 'Получение фильма по id'})
    @ApiResponse({status: 200, type: [Film]})
    @Get("/film/:id")
    async getFilmById(@Param("id") id: number) {
        const film = await this.clientData.send("getFilmById", id).toPromise();
        return film;
    }

    @ApiOperation({summary: 'Получение комента по id'})
    @ApiResponse({status: 200, type: [Comment]})
    @Get("/comments/:id")
    async getCommentsByFilmId(@Param("id") id: number) {
        const comments = await this.clientData.send("getCommentsByFilmId", id).toPromise();
        return comments;
    }

    @ApiOperation({summary: 'Изменение фильма'})
    @ApiResponse({status: 200})
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Patch("/film/:id")
    async updateFilm(@Param("id") id: number, @Body() dto: UpdateFilmDTO) {
        const film = await this.clientData.send("updateFilm", {id, dto}).toPromise();

        return film;
    }

    @ApiOperation({summary: 'Удаление фильма'})
    @ApiResponse({status: 200})
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Delete("/film/:id")
    async deleteFilmById(@Param("id") id: number) {
        return await this.clientData.send("deleteFilmById", id).toPromise();
    }

    @ApiOperation({summary: 'Изменение жанра'})
    @ApiResponse({status: 200})
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @UsePipes(ValidationPipe)
    @Patch("/genre/:id")
    async updateGenre(@Param("id") id: number, @Body() dto: GenreDTO) {
        return await this.clientData.send("updateGenre", {id, dto}).toPromise();
    }

    @ApiOperation({summary: 'Получение всех жанров'})
    @ApiResponse({status: 200})
    @Get("/genres")
    async getAllGenres() {
        const genres = await this.clientData.send("getAll.genres", "").toPromise();
        return genres.map((genre) => {
            return {id: genre.id, nameRu: genre.nameRu, nameEn: genre.nameEn};
        })
    }

    @ApiOperation({summary: 'Поиск фильмов'})
    @ApiResponse({status: 200, type: [Film]})
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

    @ApiOperation({summary: 'Создание комментария'})
    @ApiResponse({status: 200, type: [Comment]})
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    @Post("/:filmId")
    async createComment(@Param("filmId") filmId: number, @Body() dto: CommentDTO, @Req() req) {
        const userId = req.user.id;
        const comment = await this.clientData.send("createComment", {filmId, dto, userId}).toPromise();
        return comment;
    }

    @ApiOperation({summary: 'Поиск по части имени'})
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

    @ApiOperation({summary: 'Получение персона по имени и id профессии'})
    @ApiResponse({status: 200, type: [Person]})
    @Get("/findPersonsByNameAndProfession")
    async findPersonsByNameAndProfession(@Query("name") name?: string, @Query("id") id?: number) {
        const people = await this.clientData.send("findPersonsByNameAndProfession", {name, id}).toPromise();
        return people;
    }

    @ApiOperation({summary: 'Получение пользователя по токену'})
    @ApiResponse({status: 200, type: [User]})
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @UseGuards(JwtAuthGuard)
    @Get("/checkToken")
    async checkToken(@Req() req) {
        const user = req.user;
        const roles = req.user.roles;
        return {
            user: user,
            roles: roles
        };
    }
}
