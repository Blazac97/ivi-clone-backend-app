import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Film} from "../films/films.model";

interface CommentCreationAtt {
    header:string;
    value:string;
    authorId:number;
    parentId:number;
    filmId:number;
}

@Table({tableName:'Comment', timestamps:false})
export class Comment extends Model<Comment,CommentCreationAtt> {

    @Column({type:DataType.INTEGER, unique:true, autoIncrement:true, primaryKey:true})
    id:number

    @Column({type:DataType.STRING, })
    header:string

    @Column({type:DataType.STRING, })
    value:string

    @Column({type:DataType.INTEGER,})
    authorId:number

    @Column({type:DataType.INTEGER,})
    parentId:number

    @Column({type:DataType.DATE, defaultValue: DataType.NOW })
    createdAt:Date

    @ForeignKey(() => Film)
    @Column
    filmId: number;

    @BelongsTo(() => Film)
    film: Film;
}