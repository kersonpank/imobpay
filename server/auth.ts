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
      name: 'alugafacil.sid',
      store: new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'sessions',
        createTableIfMissing: false,
      }),
      secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
      resave: false,
      saveUninitialized: false,
      cookie: {
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: undefined,
      },
      proxy: process.env.NODE_ENV === 'production',
    })
  );
  
  console.log('[Auth] Session middleware configured with cookie name: alugafacil.sid');
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const DEBUG_AUTH = process.env.DEBUG_AUTH === 'true' || process.env.NODE_ENV === 'development';
  
  if (DEBUG_AUTH) {
    console.log('[isAuthenticated] Path:', req.path);
    console.log('[isAuthenticated] Session ID:', req.sessionID);
    console.log('[isAuthenticated] Session data:', JSON.stringify(req.session));
    console.log('[isAuthenticated] Cookie header:', req.headers.cookie);
  }
  
  if (!req.session?.userId) {
    if (DEBUG_AUTH) {
      console.log('[isAuthenticated] ❌ No userId in session - returning 401');
    }
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  if (DEBUG_AUTH) {
    console.log('[isAuthenticated] ✅ Authenticated userId:', req.session.userId);
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
