/**
 * Data Model Interfaces
 */
import mongoose from "mongoose";
import { control } from "../mongodb/control";
import { BaseAdherent, Adherent, modelAdherent } from "../models/adherent.interface";
import { Adherents } from "../models/adherents.interface";

/**
 * DataBase Store
 */
var connection: mongoose.Connection = mongoose.connection;
if (connection.readyState != 1 && connection.readyState != 2) async () => {
    connection = await control(process.env.PASSW as string);
}

if (connection.readyState == 1) {
    var coll = modelAdherent.db.collection("adherents");
}

/**
 * In-Memory Store
 */
let adherents: Adherents = {
    1: {
        id: 1,
        nom: "nom1",
        prenom: "prenom1",
        email: "nom1p1@gmail.com",
        adresse: "12 Place des Oliviers - 01100 Paris"
    },
    2: {
        id: 2,
        nom: "nom2",
        prenom: "prenom2",
        email: "nom2p2@gmail.com",
        adresse: "13 Place des Oliviers - 01100 Paris"
    }
}

/**
 * Service Methods
 */
export const findAll = async (): Promise<Adherent[]> => Object.values(adherents);

export const find = async (id: number): Promise<Adherent> => adherents[id];

export const create = async (newAdherent: BaseAdherent): Promise<Adherent> => {
    const id = new Date().valueOf();
    adherents[id] = {
        id,
        ...newAdherent,
    };

    return adherents[id];
}

export const update = async (
    id: number,
    adherentUpdate: BaseAdherent
): Promise<Adherent | null> => {
    const adherent = await find(id);

    if (!adherent) {
        return null;
    }

    adherents[id] = { id, ...adherentUpdate };

    return adherents[id];
}

export const remove = async (id: number): Promise<null | void> => {
    const adherent = await find(id);

    if (!adherent) {
        return null;
    }

    else {
        delete adherents[id];
    }
}


// adapter le code à la base de données au lieu du stockage mémoire