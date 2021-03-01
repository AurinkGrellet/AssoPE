/**
 * Required External Modules and Interfaces
 */

 import express, { Request, Response } from "express";
 import * as AdherentService from "./adherents.service";
 import { BaseAdherent, Adherent } from "./adherent.interface";


/**
 * Router Definition
 */

 export const adherentsRouter = express.Router();


/**
 * Controller Definitions
 */

// GET items

adherentsRouter.get("/", async (req: Request, res: Response) => {
    console.log("GET reçu");

    try {
        const adherents: Adherent[] = await AdherentService.findAll();

        res.status(200).send(adherents);
    } catch (e) {
        res.status(500).send(e.message);
    }
});


// GET items/:id

adherentsRouter.get("/:id", async (req: Request, res: Response) => {
    console.log("GET reçu");
    const id: number = parseInt(req.params.id, 10);

    try {
        const adherent: Adherent = await AdherentService.find(id);

        if (adherent) {
            return res.status(200).send(adherent);
        }

        res.status(404).send("adhérent introuvable");
    } catch (e) {
        res.status(500).send(e.message);
    }
});


// POST items

adherentsRouter.post("/", async (req: Request, res: Response) => {
    console.log("POST reçu");

    try {
        const adherent: BaseAdherent = req.body;
        
        const newAdherent = await AdherentService.create(adherent);

        res.status(201).json(newAdherent);
    } catch (e) {
        res.status(500).send(e.message);
    }
});


// PUT items/:id

adherentsRouter.put("/:id", async (req: Request, res: Response) => {
    console.log("PUT reçu");
    const id: number = parseInt(req.params.id, 10);

    try {
        const adherentUpdate: Adherent = req.body;

        const existingAdherent: Adherent = await AdherentService.find(id);

        if (existingAdherent) {
            const updatedAdherent = await AdherentService.update(id, adherentUpdate);
            return res.status(200).json(updatedAdherent);
        }

        // crée l'adhérent s'il n'existe pas
        const newAdherent = await AdherentService.create(adherentUpdate);

        res.status(201).json(newAdherent);
    } catch (e) {
        res.status(500).send(e.message);
    }
});


// DELETE items/:id

adherentsRouter.delete("/:id", async (req: Request, res: Response) => {
    console.log("DELETE reçu");
    try {
        const id: number = parseInt(req.params.id, 10);
        await AdherentService.remove(id);

        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e.message);
    }
});