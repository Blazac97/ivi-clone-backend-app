import { Controller } from '@nestjs/common';
import {CommentsService} from "./comments.service";
import {MessagePattern, Payload} from "@nestjs/microservices";
import {CommentDTO} from "./dto/commentDTO";

@Controller('comments')
export class CommentsController {

    constructor(private commentService: CommentsService) {
    }

    @MessagePattern('createComment')
    async createComment(@Payload() data: { userId: number,  filmId: number,  dto: CommentDTO }) {
        const {userId,filmId,dto} = data;
        return  await this.commentService.createComment(userId,  filmId,  dto);
    }

    @MessagePattern('getCommentsByFilmId')
    async getCommentsByFilmId(@Payload() id: number) {
        return  await this.commentService.getAllCommentsByFilmId(id);
    }
}
