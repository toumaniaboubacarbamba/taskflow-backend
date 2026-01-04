export interface JwtPayload {
  email: string;
  sub: string; // userId
  username: string;
  iat?: number; // issued at
  exp?: number; // expiration
}
