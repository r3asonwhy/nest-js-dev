import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenService } from '../tokens/token.service';
import { FindOptions, Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateUserInput, IUser, UpdateUserInput } from './interfaces/user.interface';
import { CodeType, LogActionType, LogModel, LogType, UserStatus } from '@/common/constants';
import { CognitoService } from '@/auth/cognito/cognito.service';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { I18nService } from 'nestjs-i18n';
import { LogService } from '../logs/log.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AppConfigService } from '@/config/app/config.service';
import { generateOneTimeCode } from '@/common/utils/extra.util';
import { FindUserDto } from './dto/find-user.dto';
import { UserRole } from '@/common/constants';
import { ERROR_CODES } from '@/common/error-constants';
import { NotificationService } from '@/notifications/notification.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private tokenService: TokenService,
    private readonly cognitoService: CognitoService,
    private readonly sequelize: Sequelize,
    private readonly i18nService: I18nService,
    private readonly logService: LogService,
    private readonly appConfigService: AppConfigService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createUserDto: CreateUserDto, platform?: string, createdBy?: User,): Promise<void> {
    const { code, expires_at: codeExpiresAt } = await generateOneTimeCode();
  
    const existingUser = await this.findUser({ email: createUserDto.email });
    if (existingUser) {
      throw await I18nHttpException.create('SRV-USR-1', ERROR_CODES.EMAIL_EXISTS);
    }
  
    if (createUserDto.phone) {
      const existingPhoneUser = await this.findUser({ phone: createUserDto.phone });
      if (existingPhoneUser) {
        throw await I18nHttpException.create('SRV-USR-2', ERROR_CODES.PHONE_EXISTS);
      }
    }
  
    try {
      const userCognito = await this.cognitoService.createUserCognito(
        createUserDto.email,
        createUserDto.password,
      );

      const user = await this.createUser({
        ...createUserDto,
        cognito_id: userCognito.userSub,
        status: UserStatus.PENDING,
        role: UserRole.STAFF,
        email_verified: false,
        confirmation_code: code,
        confirmation_code_type: CodeType.REGISTER,
        confirmation_code_expires: codeExpiresAt,
        created_at: new Date(),
        updated_at: new Date(),
      });
  
      const appUrl = this.appConfigService.url || `http://${this.appConfigService.host}:${this.appConfigService.port}`;
      const verificationLink = `${appUrl}/auth/verify-email/${user.email}/${user.confirmation_code}`;
  
      if (!createdBy) {
        const localizedTexts = {
          subject: await this.i18nService.translate('texts.mail.VERIFY_EMAIL_SUBJECT'),
          body: await this.i18nService.translate('texts.mail.VERIFY_EMAIL_BODY'),
          buttonText: await this.i18nService.translate('texts.mail.VERIFY_EMAIL_BUTTON')
        };

        await this.notificationService.sendNotification({
          to: user.email,
          type: 'email',
          template: 'verifyEmail',
          context: { ...localizedTexts, verificationLink },
        });
      }
  
      const userIdForLog = createdBy?.id || null;
      const updatedUserData = (user as User).toJSON();

      await this.logService.createLog<User>({
        user_id: userIdForLog,
        model: LogModel.USER,
        model_id: user.id,
        oldData: null,
        newData: updatedUserData,
        type: LogType.WORK_LOGS,
        action_type: LogActionType.UPDATE,
        client_type: platform || null,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: FindUserDto): Promise<{ data: User[]; count: number }> {
    const page = query.page || 1;
    const limit = query.limit || 15;
    const offset = limit * (page - 1);
  
    const filter = this.makeUserFilter(query, {});
  
    const users = await this.userModel.findAndCountAll({
      where: filter.where,
      order: filter.sort,
      limit,
      offset,
    });
  
    return {
      data: users.rows,
      count: users.count,
    };
  }

  async findOne(id: number): Promise<User> {
    return this.findUser({ id });
  }

  async createUser(userData: Partial<CreateUserInput>, options?: { transaction?: Transaction }): Promise<IUser> {
    return this.userModel.create(userData, options);
  }

  async update(id: number, updateData: UpdateUserDto, updated_by?: User, platform?: string): Promise<User> {
    const transaction = await this.sequelize.transaction();
    
    try {
      const oldUser = await this.findUser({ id }, null, transaction);
      if (!oldUser) {
        throw await I18nHttpException.create('SRV-USR-3', ERROR_CODES.USER_NOT_FOUND);
      }

      const oldUserData = { ...oldUser.dataValues };
  
      const attributesToUpdate = this.extractAttributesToUpdate(updateData, oldUser);
  
      if (updateData.password) {
        await this.processPasswordUpdate(oldUser, updateData.password)
      }
  
      if (attributesToUpdate.length > 0) {
        await this.cognitoService.updateAttributes(oldUser.email, attributesToUpdate);
      }
  
      await this.updateUser(oldUser, updateData, transaction);
      const updatedUserData = oldUser.dataValues;

      await this.logService.compareAndLogChanges(
        updated_by?.id || null,
        'user',
        id,
        oldUserData,
        updatedUserData,
        LogActionType.UPDATE,
        platform || null
      );
  
      await transaction.commit();
      return updatedUserData;
    } catch (error) {
      await transaction.rollback();
      throw await I18nHttpException.create('SRV-USR-4', ERROR_CODES.USER_UPDATE_FAILED);
    }
  }

  async delete(id: number, updated_by?: User, platform?: string): Promise<void> {
    const transaction = await this.sequelize.transaction();
  
    try {
      const user = await this.findUser({ id });
      if (!user) {
        throw await I18nHttpException.create('SRV-USR-5', ERROR_CODES.USER_NOT_FOUND);
      }

      const oldUserData = { ...user.dataValues };
  
      await this.cognitoService.deleteUserFromCognito(user.email);
      await this.tokenService.deleteTokensByUserId(id, transaction);
      await this.userModel.destroy({ where: { id }, transaction });

      const action = await Promise.all(
        Object.keys(oldUserData).map(async (key) => ({
          action: `${await this.i18nService.translate('texts.log.FIELD_CHANGED')} ${this.logService.localizeField('user', key)}`,
          from: oldUserData[key] ?? 'null',
          to: null,
        }))
      );

      await this.logService.createLog<User>({
        user_id: updated_by?.id || null,
        model: LogModel.USER,
        model_id: id,
        action,
        type: LogType.WORK_LOGS,
        action_type: LogActionType.DELETE,
        client_type: platform || null,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw await I18nHttpException.create('SRV-USR-6', ERROR_CODES.USER_DELETE_FAILED);
    }
  }

  async findUser(condition: Partial<User>, fields?: string[], transaction?: Transaction): Promise<User | null> {
    const queryOptions: FindOptions = { where: condition, transaction };
    if (fields && fields.length > 0) {
      queryOptions.attributes = fields;
    }
    return this.userModel.findOne(queryOptions);
  }

  async updateUser(user: User, updateData: Partial<UpdateUserInput>, transaction?: Transaction): Promise<User> {
    try {
      return await user.update(
        {...updateData, updated_at: new Date()}, 
        { transaction }
      );
    } catch (error) {
      throw await I18nHttpException.create('SRV-USR-7', ERROR_CODES.USER_UPDATE_FAILED);
    }
  }


  private makeUserFilter(dto: FindUserDto, whereObj: any): any {
    let sort = [['first_name', 'ASC']];
    const where: any = {};
  
    if (dto.search) {
      const searchField = dto.search.trim().split(' ');
  
      if (searchField.length === 1) {
        const like = `%${searchField[0].toLowerCase()}%`;
        where[Op.or] = [
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('first_name')), { [Op.like]: like }),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('last_name')), { [Op.like]: like }),
          Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('email')), { [Op.like]: like }),
        ];
      } else if (searchField.length >= 2) {
        const like = `%${dto.search.toLowerCase()}%`;
        where[Op.or] = [
          Sequelize.where(
            Sequelize.fn('LOWER', Sequelize.col('full_name')),
            { [Op.like]: like }
          ),
        ];
      }
    }
  
    if (dto.sort_field) {
      sort = dto.sort_order
        ? [[dto.sort_field, dto.sort_order]]
        : [[dto.sort_field, 'ASC']];
    }
  
    const whereConditions = [];
    if (Object.keys(whereObj).length > 0) {
      whereConditions.push(whereObj);
    }
    if (where && (where[Op.or] || where[Op.and])) {
      whereConditions.push(where);
    }
  
    const filter = {
      sort,
      where: whereConditions.length > 0 ? { [Op.and]: whereConditions } : {},
    };
  
    return filter;
  }

  private extractAttributesToUpdate(updateData: UpdateUserDto, oldUser: User): { Name: string; Value: string }[] {
    const attributesToUpdate = [];

    if (updateData.email && updateData.email !== oldUser.email) {
      attributesToUpdate.push({ Name: 'email', Value: updateData.email });
    }

    if (updateData.phone && updateData.phone !== oldUser.phone) {
      attributesToUpdate.push({ Name: 'phone_number', Value: updateData.phone });
    }

    return attributesToUpdate;
  }

  private async processPasswordUpdate(oldUser: User, newPassword: string): Promise<void> {
    await this.cognitoService.updatePassword(oldUser.email, newPassword);
  }
}
