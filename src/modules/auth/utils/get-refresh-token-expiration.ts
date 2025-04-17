export function getRefreshTokenExpiration(): Date {
  const days = 30;
  const ms = days * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + ms);
}
