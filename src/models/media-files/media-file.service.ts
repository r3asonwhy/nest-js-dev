import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MediaFile } from './entities/media-file.entity';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { getFileExtension } from '@/common/utils/extra.util';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../users/entities/user.entity';
import { LogService } from '../logs/log.service';
import { LogActionType, LogModel, LogType } from '@/common/constants';

@Injectable()
export class MediaFileService {
  private s3: S3;

  constructor(
    @InjectModel(MediaFile)
    private readonly mediaFileModel: typeof MediaFile,
    private readonly sequelize: Sequelize,
    private readonly logService: LogService,
  ) {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION_NAME,
    });
  }

  async uploadFile(file: Express.Multer.File, userId?: number, platform?: string): Promise<MediaFile> {
    const fileKey = `${uuid()}-${file.originalname}`;
    
    try {
      const uploadResult = await this.s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: fileKey,
          Body: file.buffer,
        })
        .promise();
  
      const mediaFile = await this.mediaFileModel.create({
        key: fileKey,
        url: uploadResult.Location,
        uploaded_by: userId ? userId : null,
        created_at: new Date(),
      });

      const updatedMediaFileData = (mediaFile as MediaFile).toJSON();
  
      await this.logService.createLog<MediaFile>({
        user_id: userId || null,
        model: LogModel.MEDIA_FILE,
        model_id: mediaFile.id,
        oldData: null,
        newData: updatedMediaFileData,
        type: LogType.WORK_LOGS,
        action_type: LogActionType.CREATE,
        client_type: platform || null,
      });
  
      return mediaFile;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async getFile(key: string): Promise<{ buffer: Buffer; mimeType: string }> {
    try {
      const data = await this.s3
        .getObject({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
        })
        .promise();

      if (!data.Body) throw new NotFoundException('File not found');

      const fileBuffer = data.Body as Buffer;
      const extension = getFileExtension(fileBuffer);
      const mimeType = `image/${extension}`;

      return { buffer: fileBuffer, mimeType };
    } catch (error) {
      throw new NotFoundException(`File ${key} not found in S3`);
    }
  }

  async deleteFile(key: string, updated_by?: User, platform?: string): Promise<void> {
    const transaction = await this.sequelize.transaction();
  
    try {
      const file = await this.mediaFileModel.findOne({ where: { key }, transaction });
      if (!file) {
        throw new NotFoundException(`File with key "${key}" not found`);
      }
      const oldFileData = { ...file.dataValues };
  
      await this.s3
        .deleteObject({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
        })
        .promise();
  
      await this.mediaFileModel.destroy({ where: { key }, transaction });
  
      const action = Object.keys(oldFileData).map((field) => ({
        action: `Field ${this.logService.localizeField('media_file', field)} deleted`,
        from: oldFileData[field] ?? 'null',
        to: null,
      }));
  
      await this.logService.createLog<MediaFile>({
        user_id: updated_by?.id || null,
        model: LogModel.MEDIA_FILE,
        model_id: oldFileData.id,
        action,
        type: LogType.WORK_LOGS,
        action_type: LogActionType.DELETE,
        client_type: platform || null,
      });
  
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new NotFoundException(`Failed to delete file with key "${key}"`);
    }
  }
}
