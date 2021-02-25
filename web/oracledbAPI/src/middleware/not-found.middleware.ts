import { Request, Response, NextFunction } from "express"
import { RepositoryNotTreeError } from "typeorm";

export const notFoundHandler = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const message = "Ressource introuvable";

    response.status(404).send(message);
};