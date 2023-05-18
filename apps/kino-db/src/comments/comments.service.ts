import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Comment} from "./comments.model";
import {CommentDTO} from "./dto/commentDTO";


@Injectable()
export class CommentsService {

    constructor(@InjectModel(Comment) private commentRepository: typeof Comment) {
    }

    async createComment(userId:number, parentId:number, filmId:number, dto: CommentDTO){
        const comment = await this.commentRepository.create({
            header:dto.header,
            value:dto.value,
            authorId:userId,
            parentId:parentId,
            filmId:filmId
        });
        return comment;
    }

    async getAllCommentsByFilmId(id:number){
    const comments = await this.commentRepository.findAll({
        where:{
            filmId:id
        }
    });
    if (!comments) {
      return null;
    }
    return comments;
  }
}
