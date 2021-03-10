import { Request, Response, NextFunction } from "express"
/**
 * Middleware gérant l'envoit d'une réponse au client pour l'erreur 404
 */
export const notFoundHandler = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const message = "Ressource introuvable";

    response.status(404).send(message);
};