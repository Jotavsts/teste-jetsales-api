import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

if (!secret) {
  throw new Error("JWT_SECRET não definido no .env");
}

/**
 * Gera um token JWT com o payload informado.
 */
export function generateToken(payload: object): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, secret as string, options);
}

/**
 * Middleware de autenticação JWT.
 * Verifica se o token é válido antes de prosseguir.
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token ausente ou mal formatado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret as string) as JwtPayload;
    // (req as any).user = decoded; // se quiser acessar depois
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
