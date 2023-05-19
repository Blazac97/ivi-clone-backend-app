import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { CommentsService } from './comments.service';
import { Comment } from './comments.model';

describe('CommentsService', () => {
  let service: CommentsService;

  const mockComment = {
    id: 1,
    header: 'This is header',
    value: 'This is value',
    authorId: 2,
    parentId: 3,
    filmId: 134,
  };
  const mockCommentDTO = {
    header: 'This is header',
    value: 'This is value',
    parentId: 3,
  };
  const mockCommentsRepository = {
    create: jest.fn().mockResolvedValue(mockComment),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getModelToken(Comment),
          useValue: mockCommentsRepository,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createComment', () => {
    it('should create comment', async () => {
      const result = await service.createComment(
        mockComment.authorId,
        mockComment.parentId,
        mockComment.filmId,
        mockCommentDTO,
      );

      expect(mockCommentsRepository.create).toHaveBeenCalledWith({
        authorId: mockComment.authorId,
        filmId: mockComment.filmId,
        ...mockCommentDTO,
      });
      expect(result).toEqual(mockComment);
      expect(mockCommentsRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllCommentsToFilmById', () => {
    it('should return an array of comments', async () => {
      const commentsBased = [
        {
          id: 1,
          header: 'This is header',
          value: 'This is value',
          authorId: 2,
          parentId: null,
          filmId: 134,
        },
        {
          id: 2,
          header: 'This is header 2',
          value: 'This is value 2',
          authorId: 3,
          parentId: 1,
          filmId: 134,
        },
      ];

      let sorting = [];
      for (let i = 0; i < commentsBased.length; i++) {
        let childrenComments = [];

        if (commentsBased[i].parentId === null) {
          for (let j = 0; j < commentsBased.length; j++) {
            if (commentsBased[j].parentId == commentsBased[i].id) {
              childrenComments.push(commentsBased[j]);
            }
          }

          sorting.push([commentsBased[i], childrenComments]);
        }
      }

      mockCommentsRepository.findAll.mockResolvedValue(commentsBased);
      expect(await service.getAllCommentsByFilmId(134)).toEqual(sorting);
      expect(mockCommentsRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
