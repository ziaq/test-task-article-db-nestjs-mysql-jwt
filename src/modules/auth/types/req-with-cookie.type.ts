import { Request } from 'express';

export interface ReqWithCookie extends Request {
  cookies: {
    refreshToken?: string;
  };
}
