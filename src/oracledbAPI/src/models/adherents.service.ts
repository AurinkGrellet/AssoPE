/**
 * Data Model Interfaces
 */

import mongoose from "mongoose";
import { connectMongo } from "../mongodb/connectMongo";
import { BaseAdherent, Adherent, modelAdherent } from "../models/adherent.interface";
import { Adherents } from "../models/adherents.interface";

/**
 * DataBase Store
 */

var adherents: Adherents;
var connection: mongoose.Connection = mongoose.connection;
if (connection.readyState != 1 && connection.readyState != 2) async () => {
    connection = await connectMongo(process.env.USER as string, process.env.PASSW as string, process.env.DATABASE as string);
}


/**
 * DataBase Interactions
 */

var coll: mongoose.Collection = modelAdherent.db.collection("adherents");
async function getAllAdherents() {
    adherents = await coll.find().toArray() as Adherents;
}

async function addAdherent(adherent: BaseAdherent) {
    await coll.insertOne(adherent);
}

async function updateAdherent(_id: string | number, adherent: Adherent) {
    await coll.updateOne({ _id: _id }, {
        $set: {
            nom: adherent.nom,
            prenom: adherent.prenom,
            adresse: adherent.adresse,
            email: adherent.email
        }
    });
}

async function removeAdherent(adherent: Adherent) {
    coll.deleteOne({ _id: adherent._id }, function (err) {
        if (err) console.log(err);
    });
}


/**
 * Service Methods
 */

export const findAll = async (): Promise<Adherent[]> => {
    await getAllAdherents();
    return Object.values(adherents);
}

export const find = async (id: number): Promise<Adherent> => {
    await getAllAdherents();
    return adherents[id];
}

export const create = async (newAdherent: BaseAdherent): Promise<Adherent> => {
    await getAllAdherents();

    // ajout de l'adhérent à la collection
    const _id = (adherents as Adherent[]).length;
    adherents[_id] = {
        _id,
        ...newAdherent,
    };

    // ajout de l'adhérent à la base de données
    await addAdherent(newAdherent);

    return adherents[_id];
}

export const update = async (
    _id: number,
    adherentUpdate: BaseAdherent
): Promise<Adherent | null> => {
    await getAllAdherents();

    const adherent = await find(_id);

    if (!adherent) {
        return null;
    }

    else {
        adherents[_id] = { _id, ...adherentUpdate };

        updateAdherent(adherent._id, adherents[_id]);

        return adherents[_id];
    }
}

export const remove = async (_id: number): Promise<null | void> => {
    await getAllAdherents();

    const adherent = await find(_id);

    if (!adherent) {
        return null;
    }

    else {
        removeAdherent(adherent);

        delete adherents[_id];
    }
}