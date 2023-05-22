import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Comment} from "./comments.model";
import {CommentDTO} from "./dto/commentDTO";

@Injectable()
export class CommentsService {

    constructor(@InjectModel(Comment) private commentRepository: typeof Comment) {
    }

    async createComment(userId: number, filmId: number, dto: CommentDTO) {
        const comment = await this.commentRepository.create({
            header: dto.header,
            value: dto.value,
            authorId: userId,
            nickName: dto.nickName,
            parentId: dto.parentId,
            filmId: filmId
        });
        return comment;
    }

    async getAllCommentsByFilmId(id: number) {
        const comments = await this.commentRepository.findAll({
            where: {
                filmId: id
            }
        });

        let sorting = [];

        for (let i = 0; i < comments.length; i++) {

            let childrenComments = [];

            if (comments[i].parentId === null) {

                for (let j = 0; j < comments.length; j++) {
                    if (comments[j].parentId == comments[i].id) {
                        childrenComments.push(comments[j])
                    }

                }

                sorting.push([comments[i], childrenComments])
            }

        }

        if (!sorting) {
            return null;
        }
        return sorting;
    };
};
