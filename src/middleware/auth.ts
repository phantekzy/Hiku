import { NextFunction, Request, Response } from "express";

interface JwtPayload {
  id: string;
  email: string;
  username: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
};
