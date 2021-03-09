import mongoose from "mongoose";
import { connectMongo } from "../mongodb/connectMongo";
import { BaseAdherent, Adherent, modelAdherent } from "../models/adherent.interface";
import { Adherents } from "../models/adherents.interface";

/**
 * Connexion à la Base MongoDB
 */

var adherents: Adherents;
var connection: mongoose.Connection = mongoose.connection;
if (connection.readyState != 1 && connection.readyState != 2) async () => {
    connection = await connectMongo(process.env.USER as string, process.env.PASSW as string, process.env.DATABASE as string);
}


/**
 * Interactions avec la Base de Données
 */

var coll: mongoose.Collection = modelAdherent.db.collection("adherents");
/**
 * Récupère tous les adhérents de la base
 */
async function getAllAdherents() {
    adherents = await coll.find().toArray() as Adherents;
}

/**
 * Ajoute un adhérent à la base
 * @param adherent adhérent à ajouter
 */
async function addAdherent(adherent: BaseAdherent) {
    await coll.insertOne(adherent);
}

/**
 * Met à jour les attributs d'un adhérent
 * @param _id id de l'adhérent à modifier
 * @param adherent nouveaux attributs de l'adhérent
 */
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

/**
 * Supprime un adhérent
 * @param adherent adhérent à supprimer
 */
async function removeAdherent(adherent: Adherent) {
    coll.deleteOne({ _id: adherent._id }, function (err) {
        if (err) console.log(err);
    });
}


/**
 * Méthodes du Service
 */

 /**
  * Récupère tous les adhérents de la base
  * @returns vecteur des adhérents
  */
export const findAll = async (): Promise<Adherent[]> => {
    await getAllAdherents();
    return Object.values(adherents);
}

/**
 * Récupère un adhérent à partir de son id
 * @param id id de l'adhérent à récupérer
 * @returns adhérent correspondant à l'id reçu
 */
export const find = async (id: number): Promise<Adherent> => {
    await getAllAdherents();
    return ((adherents as Adherent[]).find((adherent) => {return adherent._id == id}) as Adherent);
}

/**
 * Crée un nouvel adhérent et l'ajoute à la base
 * @param newAdherent adhérent à créer
 * @returns le nouvel adhérent
 */
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

/**
 * Met à jour les attributs d'un adhérent
 * @param _id id de l'adhérent à modifier
 * @param adherentUpdate nouveaux attributs de l'adhérent
 * @returns adhérent modifié
 */
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

/**
 * Supprime un adhérent
 * @param _id id de l'adhérent à supprimer
 */
export const remove = async (_id: number): Promise<null | void> => {
    await getAllAdherents();

    const adherent = await find(_id);

    if (!adherent) {
        return null;
    }

    else {
        removeAdherent(adherent);

        let arrayId: number = (adherents as Adherent[]).findIndex((adherent) => { return adherent._id == _id });
        delete adherents[arrayId];
    }
}