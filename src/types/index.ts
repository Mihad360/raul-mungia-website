/* eslint-disable @typescript-eslint/no-explicit-any */
export type IMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TResponse = {
  data: any;
  meta?: IMeta;
};

export interface JwtPayload {
  userId: string;
  email: string;
  role: "user" | "admin" | "super_admin" | string;
  exp: number; // expiration time (unix)
  iat: number; // issued at
}

/** Type for user stored in cookies */
export interface ICookieUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin" | "super_admin" | string;
  isVerified?: boolean;
}
