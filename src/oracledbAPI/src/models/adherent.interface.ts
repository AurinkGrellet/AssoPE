import mongoose from "mongoose";

// remplacer _id par un autre "id", qui lui sera un nombre simple & choisi de façon incrémentale dans le frontend

/**
 * Informations basiques d'un adhérent
 */
export interface BaseAdherent {
    nom: string,
    prenom: string,
    adresse: string,
    email: string
}

/**
 * Informations d'un adhérent
 */
export interface Adherent extends BaseAdherent {
    _id: number | string
}

/**
 * Schéma utilisé par l'API
 */
var AdherentSchema: mongoose.Schema = new mongoose.Schema(
    {
        nom: { type: String, require: true, maxlength: 100 },
        prenom: { type: String, require: true, maxlength: 100 },
        adresse: { type: String, require: true, maxlength: 200 },
        email: { type: String, maxlength: 100 }
    }
);

/**
 * Modèle utilisé par l'API
 */
export var modelAdherent = mongoose.model("Adherent", AdherentSchema);