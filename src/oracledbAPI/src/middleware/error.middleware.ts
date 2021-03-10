import HttpException from "../common/http-exception";
import { Request, Response, NextFunction } from "express";

/**
 * Middleware gérant la réponse au client pour les erreurs génériques
 */
export const errorHandler = (
    error: HttpException,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const status = error.statusCode || error.status || 500;

    response.status(status).send(error);
};