import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_socialsphere_jwt_key_10293847";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, JWT_SECRET);

      req.user = {
        id: decoded.id,
        email: decoded.email,
      };

      return next();
    } catch (error) {
      return res.status(401).json({ error: "Not authorized, invalid token" });
    }
  }

  return res.status(401).json({ error: "Not authorized, no token provided" });
};

export const optionalProtect = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded: any = jwt.verify(token, JWT_SECRET);

      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
    } catch (error) {
      // Gracefully continue as guest if token is invalid or expired
    }
  }
  next();
};
