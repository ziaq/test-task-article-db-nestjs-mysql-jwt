import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

const ERROR_DESCRIPTIONS: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Access Denied',
  404: 'Not Found',
  409: 'Conflict',
};

export function ApiCommonErrors(...statusCodes: number[]) {
  const decorators = statusCodes.map((status) =>
    ApiResponse({
      status,
      description: ERROR_DESCRIPTIONS[status] || 'Error',
    }),
  );

  return applyDecorators(...decorators);
}
