import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostModuleDto } from './dto/create-post-module.dto';
import { UpdatePostModuleDto } from './dto/update-post-module.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post-module.entity';
import { Model } from 'mongoose';
import { ListPostModuleDto } from './dto/list.module.dto';

@Injectable()
export class PostModuleService {
  constructor(@InjectModel(Post.name) private PostModel: Model<Post>) {}

  async create(createPostModuleDto: CreatePostModuleDto) {
    let ref = new this.PostModel(createPostModuleDto);
    let data = await ref.save();

    return {
      statusCode: HttpStatus.OK,
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
    let loggedInUser = payload.user_id;
    let postData = [];

    postData = await this.PostModel.aggregate([
      {
        $addFields: {
          userId: { $toObjectId: '$created_by' },
          postId: { $toString: '$_id' },
        },
      },
      { $match: { status: 1, is_deleted: 1 } },
      {
        $lookup: {
          from: 'users',
          foreignField: '_id',
          localField: 'userId',
          as: 'users',
          pipeline: [
            {
              $project: {
                _id: 1,
                username: 1,
                role: 1,
                slug: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: '$users',
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

    let count = await this.PostModel.countDocuments( { status: 1, is_deleted: 0 } );
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
    let data = await this.PostModel.findOne({ slug: slug });
    return {
      statusCode: HttpStatus.OK,
      error: {},
      message: 'Fetched successfully',
      data: data,
    };
  }

}
