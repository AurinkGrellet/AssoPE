import mongoose from "mongoose";

export interface BaseAdherent {
    nom: string,
    prenom: string,
    adresse: string,
    email: string
}

export interface Adherent extends BaseAdherent {
    _id: number | string
}

var AdherentSchema: mongoose.Schema = new mongoose.Schema(
    {
        nom: { type: String, require: true, maxlength: 100 },
        prenom: { type: String, require: true, maxlength: 100 },
        adresse: { type: String, require: true, maxlength: 200 },
        email: { type: String, maxlength: 100 }
    }
);

export var modelAdherent = mongoose.model("Adherent", AdherentSchema);