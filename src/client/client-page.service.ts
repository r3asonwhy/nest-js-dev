import { Injectable, NotFoundException } from '@nestjs/common';
import { renderTemplate } from '@/common/helpers/template.helper';
import { I18nContext } from 'nestjs-i18n';
import { HomePageTemplate } from '@/models/pages/interfaces/template.interface';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { User } from '@/models/users/entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Page } from '@/models/pages/entities/page.entity';
import { PageSection } from '@/models/pages/entities/page-section.entity';
import { SlugService } from '@/models/slugs/slug.service';
import { LayoutService } from '@/admin/layouts/layout.service';
import { IPopupQuery, SectionContent, TemplateDataMap } from './interfaces/client.interface';
import { LAYOUT_PATH, STATIC_PAGES, STATIC_TEMPLATE_MAP } from '@/common/constants';
import { ERROR_CODES } from '@/common/error-constants';
import { TemplateService } from '@/common/utils/template.util';
import { RequestWithUser } from '@/common/interfaces/request.interface';

@Injectable()
export class ClientPageService {
  constructor(
    @InjectModel(Page) private readonly pageModel: typeof Page,
    private readonly slugService: SlugService,
    private readonly layoutService: LayoutService,
    private readonly templateUtilService: TemplateService,
  ) {}

  async renderPage(slug: string, lang: string, user?: User): Promise<string> {
    if (STATIC_PAGES.includes(slug)) {
      return await this.renderStaticPage(slug);
    }
    return await this.renderPageBySlug(slug, lang, user);
  }

  async renderStaticPage(slug: string): Promise<string> {
    const templateKey = slug as keyof TemplateDataMap;
    if (!STATIC_TEMPLATE_MAP[templateKey]) {
      throw new NotFoundException(`Static template not found for slug: "${slug}"`);
    }

    return await renderTemplate(templateKey);
  }

  async renderPageBySlug(
    slug: string,
    lang: string,
    user?: User
  ): Promise<string> {
    const slugRecord = await this.slugService.findSlugByNameAndLanguage(slug, lang);
  
    if (!slugRecord) {
      throw new NotFoundException(`Slug not found: "${slug}" for language "${lang}".`);
    }
  
    const page = await this.getPageById(slugRecord.resource_id);
    if (!page) {
      throw new NotFoundException(`Page not found for slug: "${slug}".`);
    }
  
    const templateKey = page.template as keyof TemplateDataMap;
    const data = await this.getPageData(templateKey, user);
  
    return await this.getPageHtml(templateKey, data);
  }

  async getPageHtml<T extends keyof TemplateDataMap>(
    templateKey: T,
    data: TemplateDataMap[T]
  ): Promise<string> {
    return await renderTemplate(templateKey, data);
  }

  async getPageData<T extends keyof TemplateDataMap>(templateKey: T, user?: User): Promise<TemplateDataMap[T]> {
    switch (templateKey) {
      case 'home':
        return await this.getHomePageData(user) as TemplateDataMap[T];
      default:
        throw await I18nHttpException.create('SRV-CPG-1', ERROR_CODES.TEMPLATE_DATA_NOT_DEFINED, { templateKey });
    }
  }

  async getPageById(pageId: number): Promise<Page | null> {
    return await this.pageModel.findOne({
      where: { id: pageId },
      include: [{ all: true }],
    });
  }

  private async getHomePageData(user: User): Promise<HomePageTemplate> {
    const lang = I18nContext.current().lang;
  
    const page = await this.pageModel.findOne({
      where: { template: 'home', lang },
      include: [{ model: PageSection }],
    });

    if (!page) {
      throw await I18nHttpException.create('SRV-CPG-2', ERROR_CODES.PAGE_NOT_FOUND);
    }

    const menu = await this.layoutService.getMenu(lang);
    const headerFooter = await this.layoutService.getHeaderFooter(lang);

    return {
      lang,
      user,
      title: page.title,
      layout: LAYOUT_PATH,
      menu: menu.value,
      header_footer: {
        header_logo: `/images/${headerFooter.header_logo.id}`,
        footer_logo: `/images/${headerFooter.footer_logo.id}`,
        address: headerFooter.address,
        copyright: headerFooter.copyright,
        phones: headerFooter.phones,
        schedule: headerFooter.schedule,
        social_network: headerFooter.social_network.map((network) => ({
          icon: `/images/${network.icon.id}`,
          link: network.link,
        })),
      },
      content: page.sections.map((section) => {
        const content = section.content as SectionContent;
        return {
          type: section.type,
          title: content?.title || null,
          text: content?.text || null,
          image_id: content?.image_id || null,
          link: content?.link || null,
          link_title: content?.link_title || null,
        };
      }),
    };
  }

  async generatePopupContent(
    req: RequestWithUser,
    popupName: string,
    query: IPopupQuery
  ): Promise<string> {
    const renderPage = 'partials/dynamic-popups';
    const popupData: any = { isDisappear: false, lang: req.lang };

    switch (popupName) {
      case 'pass-restore-2':
        popupData.phone = query.phone;
        break;
      case 'pass-restore-3':
        popupData.phone = query.phone;
        break;
      case 'forgot-password-success':
        popupData.phone = query.phone;
        break;
      default:
        break;
    }

    const html = await this.templateUtilService.getTemplate(
      {
        popupName,
        ...popupData,
        user: req.user
      },
      renderPage
    );

    return html;
  }

  async handleLocalizationError(errorCode: string): Promise<void> {
    if (!errorCode) {
      throw await I18nHttpException.create('SRV-CPG-3', ERROR_CODES.ERROR_CODE_REQUIRED);
    }

    if (!ERROR_CODES[errorCode]) {
      throw await I18nHttpException.create('SRV-CPG-4', ERROR_CODES.INVALID_ERROR_CODE);
    }

    const exception = await I18nHttpException.create('SRV-CPG-5', ERROR_CODES[errorCode]);
    throw exception;
}
}

