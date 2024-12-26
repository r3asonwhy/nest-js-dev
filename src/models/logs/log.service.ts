import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Log } from './entities/log.entity';
import { LogActionType, LogType } from '@/common/constants';
import { I18nService } from "nestjs-i18n";
import { FindLogDto } from './dto/find-log.dto';
import { Op, Sequelize } from 'sequelize';
import { CreateLogParams, fieldMappings } from './interfaces/log.interface';

export function getMappedValue(
  model: keyof typeof fieldMappings,
  field: string,
  value: any
): string | number | null {
  const fieldMap = fieldMappings[model]?.[field];
  return fieldMap ? fieldMap[value] || value : value;
}

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log)
    private readonly logModel: typeof Log,
    @Inject(I18nService) private readonly i18nService: I18nService
  ) {}

  async findAll(query: FindLogDto): Promise<{ data: Log[]; count: number }> {
    const page = query.page || 1;
    const limit = query.limit || 15;
    const offset = limit * (page - 1);
  
    const filter = this.makeLogFilter(query, {});
  
    const users = await this.logModel.findAndCountAll({
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

  private makeLogFilter(dto: FindLogDto, whereObj: any): any {
    let sort = [['created_at', 'ASC']];
    const where: any = {};
  
    if (dto.search) {
      const searchString = `%${dto.search.trim().toLowerCase()}%`;
      where[Op.or] = [
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('model')), { [Op.like]: searchString }),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('type')), { [Op.like]: searchString }),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('client_type')), { [Op.like]: searchString }),
        Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('action_type')), { [Op.like]: searchString }),
      ];
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
    if (Object.keys(where).length > 0) {
      whereConditions.push(where);
    }
  
    const filter = {
      sort,
      where: whereConditions.length > 0 ? { [Op.and]: whereConditions } : {},
    };
  
    return filter;
  }

  async compareAndLogChanges(
    user_id: number,
    model: string,
    model_id: number,
    oldData: any,
    newData: any,
    action_type: LogActionType,
    client_type: string | null = null
  ) {
    const changes = await this.getDiff(oldData, newData, model as "user");
    if (changes.length > 0) {
      await this.createLog({
        user_id,
        model: model as "user",
        model_id,
        action: changes,
        type: LogType.WORK_LOGS,
        action_type,
        client_type,
      });
    }
  }

  async createLog<T>(logData: CreateLogParams<T>) {
    const action = logData.action || await this.getDiff(logData.oldData, logData.newData, logData.model);
    await this.logModel.create({
      ...logData,
      action: JSON.stringify(action),
      created_at: new Date(),
    });
  }

  async getDiff<T>(
    oldData: T | null,
    newData: T | null,
    model: keyof typeof fieldMappings
  ): Promise<Array<{ action: string; from: string | null; to: string | null }>> {
    const diff = [];
    const compare = async (oldObj: any, newObj: any, path = '') => {
      if (!oldObj) {
        for (const key in newObj) {
          if (key === 'dataValues') continue;
          const fullPath = path ? `${path}.${key}` : key;
          const fromValue = null;
          const toValue = getMappedValue(model, key, newObj[key]);
          diff.push({
            action: `${await this.i18nService.translate('texts.log.FIELD_ADDED')} ${this.localizeField(model, key)}`,
            from: fromValue,
            to: toValue,
          });
        }
        return;
      }
      for (const key in oldObj) {
        if (key === 'dataValues') continue;
        const fullPath = path ? `${path}.${key}` : key;
        if (typeof oldObj[key] === 'object' && typeof newObj[key] === 'object') {
          await compare(oldObj[key], newObj[key], fullPath);
        } else if (oldObj[key] !== newObj[key]) {
          const fromValue = getMappedValue(model, key, oldObj[key]);
          const toValue = getMappedValue(model, key, newObj[key]);
          diff.push({
            action: `${await this.i18nService.translate('texts.log.FIELD_CHANGED')} ${this.localizeField(model, key)}`,
            from: fromValue,
            to: toValue,
          });
        }
      }
    };
    await compare(oldData, newData);
    return diff;
  }  
  

  localizeField(model: string, field: string): string {
    try {
      const translationKey = `${model}.${field}`;
      return this.i18nService.translate(`texts.field.${translationKey}`, {
        defaultValue: field,
      });
    } catch (error) {
      return field;
    }
  }
}
