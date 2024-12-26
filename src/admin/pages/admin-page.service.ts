import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';
import { Page } from '@/models/pages/entities/page.entity';
import { SlugService } from '@/models/slugs/slug.service';
import { PageSection } from '@/models/pages/entities/page-section.entity';
import { LANGUAGES } from '@/common/constants';
import { CreatePageDto, SectionDto } from './dto/create-page.dto';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { ERROR_CODES } from '@/common/error-constants';

@Injectable()
export class AdminPageService {
  constructor(
    @InjectModel(Page) private readonly pageModel: typeof Page,
    @InjectModel(PageSection) private readonly pageSectionModel: typeof PageSection,
    private readonly slugService: SlugService,
    private readonly sequelize: Sequelize,
  ) {}

  async saveOrUpdatePage(data: CreatePageDto, userId: number): Promise<Page> {
    const transaction = await this.sequelize.transaction();
    try {
      const { id, title, sections, template, status, slug, type } = data;
      let resultPage: Page | null = null;

      if (!sections || !Array.isArray(sections) || sections.length === 0) {
        throw await I18nHttpException.create('SRV-APG-1', ERROR_CODES.SECTIONS_REQUIRED);
      }

      if (!id) {
        // Create a new page
        if (!template) {
          throw await I18nHttpException.create('SRV-APG-2', ERROR_CODES.TEMPLATE_REQUIRED);
        }

        for (const lang of LANGUAGES) {
          const pageData = {
            lang,
            title,
            type,
            template,
            status: status || 'waiting',
            slug: await this.slugService.generateAndValidateSlug(title, lang, slug),
            updated_by: userId,
            created_at: new Date(),
            updated_at: new Date(),
          };

          const sectionsData = this.convertPageSectionsForDBFormat(sections);
          const page = await this.createPageWithSections(pageData, sectionsData, transaction);
          if (!resultPage) resultPage = page;
        }
      } else {
        // Update existing page
        const page = await this.pageModel.findByPk(id);
        if (!page) {
          throw await I18nHttpException.create('SRV-APG-3', ERROR_CODES.PAGE_NOT_FOUND);
        }

        const pageData = {
          title,
          type,
          template,
          status,
          updated_user_id: userId,
          slug: slug || (await this.slugService.generateAndValidateSlug(title, page.lang)),
          updated_at: new Date(),
          updated_by: userId,
        };

        const sectionsData = this.convertPageSectionsForDBFormat(sections);
        resultPage = await this.updatePage(page.id, pageData, sectionsData, transaction);
      }

      await transaction.commit();
      return resultPage;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  private convertPageSectionsForDBFormat(sections: SectionDto[]): any[] {
    return sections.map(async (section) => {
      if (!section.type || !section.content) {
        throw await I18nHttpException.create('SRV-APG-4', ERROR_CODES.SECTION_FIELDS_REQUIRED);
      }
  
      return {
        type: section.type,
        content: section.content,
      };
    });
  }

  private async updatePage(
    pageId: number,
    pageData: any,
    sectionsData: any[],
    transaction: Transaction
  ): Promise<Page> {
    await this.pageSectionModel.destroy({ where: { page_id: pageId }, transaction });
  
    for (const section of sectionsData) {
      section.page_id = pageId;
      await this.pageSectionModel.create(section, { transaction });
    }
  
    await this.pageModel.update(pageData, { where: { id: pageId }, transaction });
  
    return await this.pageModel.findByPk(pageId, { include: [PageSection], transaction });
  }

  private async createPageWithSections(pageData: any, sectionsData: any[], transaction: Transaction): Promise<Page> {
    const page = await this.pageModel.create(pageData, { transaction });

    await this.slugService.createSlug(pageData.slug, pageData.lang, 'page', page.id);
  
    for (const section of sectionsData) {
      section.page_id = page.id;
      await this.pageSectionModel.create(section, { transaction });
    }
  
    return page;
  }
}
