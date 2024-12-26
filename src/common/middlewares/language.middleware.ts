import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LANGUAGES } from '../constants';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const langHeader = req.headers['accept-language'] as string;
    req['lang'] = LANGUAGES.includes(langHeader) ? langHeader : LANGUAGES[0];
    next();
  }
}
