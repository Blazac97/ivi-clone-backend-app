import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Film} from "../films/films.model";
import {ApiProperty} from "@nestjs/swagger";

interface CommentCreationAtt {
    header:string;
    value:string;
    authorId:number;
    nickName:string
    parentId:number;
    filmId:number;
}

@Table({tableName:'Comment', timestamps:false})
export class Comment extends Model<Comment,CommentCreationAtt> {

    @ApiProperty({example:'1', description:'Уникальный идентификатор'})
    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number

    @ApiProperty({example:'Заголовок', description:'Заголовок комента'})
    @Column({type:DataType.STRING, })
    header:string

    @ApiProperty({example:'Текст', description:'Текст комента'})
    @Column({type:DataType.STRING, })
    value:string

    @ApiProperty({example:'1', description:'id user который написал комент'})
    @Column({type:DataType.INTEGER,})
    authorId:number

    @ApiProperty({example:'1', description:'id user комента к которому пишется коментт'})
    @Column({type:DataType.INTEGER,})
    parentId:number

    @ApiProperty({description:'дата создания комента'})
    @Column({type:DataType.DATE, defaultValue: DataType.NOW })
    createdAt:Date

    @ApiProperty({description:'никнейм юзера'})
    @Column({type:DataType.INTEGER,})
    nickName:number

    @ForeignKey(() => Film)
    @Column
    filmId: number;

    @BelongsTo(() => Film)
    film: Film;
}