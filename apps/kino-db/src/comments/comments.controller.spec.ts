import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

describe('GenresController', () => {
  let controller: CommentsController;
  let service: CommentsService;

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

  const mockCommentsService = {
    createComment: jest.fn().mockResolvedValue(mockComment),
    getAllCommentsByFilmId: jest.fn().mockResolvedValue(commentsBased),
    create: jest.fn().mockResolvedValue(mockComment),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createComment', () => {
    it('should create comment', async () => {
      const result = await controller.createComment({
        userId: mockComment.authorId,
        dto: mockCommentDTO,
        filmId: mockComment.filmId,
      });
      expect(result).toEqual(mockComment);
      expect(mockCommentsService.createComment).toHaveBeenCalledTimes(1);
    });
  });
  describe('getCommentsByFilmId', () => {
    it('should get array of comments for film with id 134', async () => {
      expect(await controller.getCommentsByFilmId(134)).toEqual(commentsBased);
      expect(mockCommentsService.getAllCommentsByFilmId).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
