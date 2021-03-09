import { Request, Response, NextFunction } from "express"
export const notFoundHandler = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const message = "Ressource introuvable";

    response.status(404).send(message);
};