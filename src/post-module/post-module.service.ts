import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostModuleDto } from './dto/create-post-module.dto';
import { UpdatePostModuleDto } from './dto/update-post-module.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post-module.entity';
import { Model } from 'mongoose';
import { ListPostModuleDto } from './dto/list.module.dto';
import { PostLike } from './entities/post-like.entity';
import { LikePostDto } from './dto/like-post.dto';

@Injectable()
export class PostModuleService {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<Post>,
    @InjectModel(PostLike.name) private PostLikeModel: Model<PostLike>,
  ) {}

  async create(createPostModuleDto: CreatePostModuleDto) {
    let ref = new this.PostModel(createPostModuleDto);
    let data = await ref.save();

    return {
      statusCode: HttpStatus.CREATED,
      error: {},
      message: 'Created',
      data: data,
    };
  }

  // getting post list of post behalf of user id (getting user id from token)
  async findAll(payload: ListPostModuleDto) {
    let pageSize = payload.itemsPerPage ? payload.itemsPerPage : 10;
    let skip =
      payload.pageNumber <= 0 || payload.pageNumber == 1
        ? 0
        : (payload.pageNumber - 1) * pageSize;
    let postData = [];

    postData = await this.PostModel.aggregate([
      {
        $addFields: {
          userId: { $toObjectId: '$created_by' },
        },
      },
      { $match: { status: 1, is_deleted: 0 } },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'userId',
          as: 'author',
          pipeline: [
            {
              $project: {
                _id: 0,
                username: 1,
                slug: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: '$author',
      },
      {
        $project: {
          status: 0,
          is_deleted: 0,
          created_by: 0,
          __v: 0,
          userId: 0,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ]).sort({ createdAt: -1 });

    let count = await this.PostModel.countDocuments({
      status: 1,
      is_deleted: 0,
    });
    return {
      statusCode: HttpStatus.OK,
      error: {},
      message: 'Fetched successfully',
      data: {
        records: postData,
        totalCount: count,
      },
    };
  }

  async findOne(slug: any) {
    let data = await this.PostModel.aggregate([
      {
        $addFields: {
          userId: { $toObjectId: '$created_by' },
        },
      },
      { $match: { status: 1, is_deleted: 0, slug: slug } },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'userId',
          as: 'author',
          pipeline: [
            {
              $project: {
                _id: 0,
                username: 1,
                slug: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: '$author',
      },
      {
        $project: {
          status: 0,
          is_deleted: 0,
          created_by: 0,
          __v: 0,
          userId: 0,
        },
      },
    ]);
    return {
      statusCode: HttpStatus.OK,
      error: {},
      message: 'Fetched successfully',
      data: data[0],
    };
  }

  async remove(slug: string) {
    let count = await this.PostModel.findOneAndUpdate(
      { slug: slug, is_deleted: 0 },
      { $set: { is_deleted: 1 } },
    );
    if (!count) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: {},
        message: 'No post found for slug ' + slug,
      };
    }

    return {
      statusCode: HttpStatus.OK,
      error: {},
      message: 'Post has been deleted successfully',
    };
  }

  async likePost(payload: LikePostDto) {
    /** check already liked */

    let count = await this.PostLikeModel.count(payload);
    if(count){
      return {
        statusCode: HttpStatus.OK,
        error: {},
        message: 'Already liked',
      };
    }
    let ref = new this.PostLikeModel(payload);
    await ref.save();

    return {
      statusCode: HttpStatus.CREATED,
      error: {},
      message: 'Post liked',
    };
  }
  async unLikePost(payload: LikePostDto) {
    let data = await this.PostLikeModel.findOneAndDelete(payload)
    if(!data){
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        error: {},
        message: 'No such post exists.',
      };
    }
    
    return {
      statusCode: HttpStatus.OK,
      error: {},
      message: 'Post unLiked',
    };
  }
}
