import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { TEMPLATE_FILE_MAP, TemplateDataMap } from '@/client/interfaces/client.interface';
import * as fs from 'fs';
import * as path from 'path';
import { ERROR_CODES } from '../error-constants';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as handlebars from 'handlebars';

export async function renderTemplate<T extends keyof TemplateDataMap>(
  templateKey: T,
  data: TemplateDataMap[T] = {} as TemplateDataMap[T]
): Promise<string> {
  const templateFileName = TEMPLATE_FILE_MAP[templateKey];
  const templatePath = path.join(process.cwd(), 'views', `${templateFileName}.hbs`);

  if (!fs.existsSync(templatePath)) {
    throw await I18nHttpException.create(
      'HLP-TMP-1',
      ERROR_CODES.TEMPLATE_NOT_FOUND,
      { templateFileName, templatePath }
    );
  }

  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const compiledTemplate = handlebars.compile(templateSource);

  // Checking if the template belongs to email-template
  if (templatePath.includes(path.join('views', 'email-template'))) {
    // If the template is for email, we return only the compiled template
    return compiledTemplate(data);
  }

  // Layout wrapper for other templates
  const layoutPath = path.join(process.cwd(), 'views', 'client', 'layout.hbs');
  if (!fs.existsSync(layoutPath)) {
    throw await I18nHttpException.create(
      'HLP-TMP-2',
      ERROR_CODES.TEMPLATE_NOT_FOUND,
      { templateFileName: 'layout.hbs', templatePath: layoutPath }
    );
  }

  const layoutSource = fs.readFileSync(layoutPath, 'utf8');
  const layoutTemplate = handlebars.compile(layoutSource);

  const content = compiledTemplate(data);
  return layoutTemplate({ ...data, body: content });
}

export const registerPartials = (partialsPath: string) => {
  if (existsSync(partialsPath)) {
    
    const files = readdirSync(partialsPath);

    files.forEach((file) => {
      if (file.endsWith('.hbs')) {
        const partialName = file.replace('.hbs', '');
        const partialContent = readFileSync(join(partialsPath, file), 'utf8');
        handlebars.registerPartial(partialName, partialContent);
      }
    });
  } else {
    console.error(`Partials directory does not exist: ${partialsPath}`);
  }
};
