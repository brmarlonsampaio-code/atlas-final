import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Autenticação simples por chave secreta (header x-admin-key), suficiente
 * pro caso de uso real: um único administrador (Marlon), sem necessidade
 * de sistema de contas/sessões. A chave vive em ADMIN_API_KEY no .env,
 * nunca commitada.
 */
@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (!process.env.ADMIN_API_KEY) {
      throw new UnauthorizedException(
        'ADMIN_API_KEY não configurada no servidor. Defina em apps/backend/.env',
      );
    }

    const request = context.switchToHttp().getRequest();
    const providedKey = request.headers['x-admin-key'];

    if (!providedKey || providedKey !== process.env.ADMIN_API_KEY) {
      throw new UnauthorizedException('Chave de administrador ausente ou inválida.');
    }

    return true;
  }
}
