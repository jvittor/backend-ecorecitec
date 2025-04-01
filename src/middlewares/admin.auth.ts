import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

type TokenPayload = {
    id: string;
    role: string;
    iat: number;
    exp: number;
};

interface CustomRequest extends Request {
    userId?: string;
    userRole?: string;
}

export function AdminMiddleware(
    req: CustomRequest,
    res: Response,
    next: NextFunction
) {
    if (req.userRole !== "admin") {
        return res.status(403).json({ error: "Acesso negado: apenas administradores podem realizar esta ação" });
    }
    next();
}