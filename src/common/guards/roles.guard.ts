import { UserRole } from '@/common/constants';
import { ROLES_KEY } from '../decorators/roles-auth.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nHttpException } from '@/common/exceptions/i18n-http-exception';
import { ERROR_CODES } from '../error-constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    if (!user || !user.role) {
      throw await I18nHttpException.create('GRD-ROL-1', ERROR_CODES.USER_ROLE_NOT_FOUND);
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw await I18nHttpException.create('GRD-ROL-2', ERROR_CODES.NO_PERMISSION);
    }

    return true;
  }
}
