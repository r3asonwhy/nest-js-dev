import { Injectable, BadRequestException } from '@nestjs/common';
import slugify from 'slugify';
import { Slug } from './entities/slug.entity';

@Injectable()
export class SlugService {
  async generateAndValidateSlug(
    title: string,
    lang: string,
    userSlug?: string
  ): Promise<string> {
    let baseSlug = userSlug
      ? slugify(userSlug, { lower: true, strict: true })
      : slugify(title, { lower: true, strict: true });

    const uniqueSlug = await this.generateUniqueSlug(baseSlug, lang);
    return uniqueSlug;
  }

  private async generateUniqueSlug(baseSlug: string, lang: string): Promise<string> {
    let count = 1;
    let uniqueSlug = baseSlug;
  
    while (await this.findSlugByNameAndLanguage(uniqueSlug, lang)) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }
  
    return uniqueSlug;
  }

  async findSlugByNameAndLanguage(slug: string, lang: string): Promise<Slug | null> {
    return await Slug.findOne({ where: { slug, lang } });
  }

  async createSlug(
    slug: string,
    lang: string,
    resourceType: string,
    resourceId: number
  ): Promise<Slug> {
    try {
      const uniqueSlug = await this.generateUniqueSlug(slug, lang);
  
      return await Slug.create({
        slug: uniqueSlug,
        lang,
        resource_type: resourceType,
        resource_id: resourceId,
      });
    } catch (error) {
      console.error('Error creating slug:', error.message);
      throw new BadRequestException(`Failed to create slug: ${error.message}`);
    }
  }
}
