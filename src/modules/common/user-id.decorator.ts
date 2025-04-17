import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { JwtPayload } from '../auth/types/jwt-payload.type';

export const UserId = createParamDecorator(
  (_data, ctx: ExecutionContext): number => {
    const req = ctx.switchToHttp().getRequest<Request & { user: JwtPayload }>();
    return req.user?.sub;
  },
);
