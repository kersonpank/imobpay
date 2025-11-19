import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import bcrypt from "bcrypt";
import { storage } from "./storage";

const PgSession = connectPg(session);

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

const SALT_ROUNDS = 12;

export async function setupAuth(app: Express): Promise<void> {
  app.use(
    session({
      store: new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'sessions',
        createTableIfMissing: false,
      }),
      secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      },
    })
  );
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.session?.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  (req as AuthenticatedRequest).userId = req.session.userId;
  next();
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
