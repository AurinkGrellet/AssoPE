import { NOMEM } from "dns";
import mongoose from "mongoose";

export interface Adherent {
    id: number,
    nom: string,
    prenom: string,
    adresse: string,
    email: string
}

var AdherentSchema: mongoose.Schema = new mongoose.Schema(
    {
        nom: { type: String, require: true, maxlength: 100 },
        prenom: { type: String, require: true, maxlength: 100 },
        adresse: { type: String, require: true, maxlength: 200 },
        email: { type: String, maxlength: 100 }
    }
);

// Virtual pour le nom complet de l'adherent
AdherentSchema
.virtual('nomComplet')
.get(function () {
    return this.nom + ', ' + this.prenom;
});

export var modelAdherent = mongoose.model("Adherent", AdherentSchema);

/*
export interface BaseAdherent {
    nom: string,
    prenom: string,
    email: string,
    adresse: string
}

export interface Adherent extends BaseAdherent {
    id: number;
}*/