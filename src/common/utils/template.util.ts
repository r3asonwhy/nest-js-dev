import handlebars from 'handlebars';
import { helpers } from '@/common/helpers/handebar-helpers';

handlebars.registerHelper(helpers);
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TemplateService {
  public async getTemplate(data, type, I18n?: any): Promise<any> {
    const file = await fs.readFileSync(`views/${type}.hbs`);
    const source = file.toString();
    const template = handlebars.compile(source);
    if (data.lang) {
      if (I18n) {
        handlebars.registerHelper('t', I18n.hbsHelper);
      } else {
        const langFile = await fs.readFileSync(
          `src/i18n/${data.lang}/texts.json`,
        );
        const langData = JSON.parse(langFile.toString());
        handlebars.registerHelper('t', function (key) {
          function getNestedValue(obj, keyPath) {
            return keyPath.split('.').reduce((acc, part) => acc && acc[part], obj);
          }
        
          const translation = getNestedValue(langData, key);
          return translation || `Missing translation: ${key}`;
        });
      }
    }

    return await template(data);
  }
}
