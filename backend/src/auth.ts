// src/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Gera um token a partir de um payload
export function generateToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

// Middleware que valida o token JWT
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token ausente ou mal formatado" });
  }
  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
