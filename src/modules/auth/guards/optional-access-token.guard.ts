import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(_err: any, user: any, _info: any, _context: ExecutionContext) {
    return user ?? null;
  }
}
