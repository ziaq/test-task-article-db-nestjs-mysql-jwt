import { ReqWithCookie } from './req-with-cookie.type';

export interface ReqtWithBodyCookie extends ReqWithCookie {
  body: {
    fingerprint: string;
  };
}
