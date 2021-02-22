/**
 * Data Model Interfaces
 */
import mongoose from "mongoose";
import {modelAdherent} from "../models/adherent.interface";

/**
 * In-Memory Store
 */
var connection: mongoose.Connection = mongoose.connection;

if (connection) {
    var coll = modelAdherent.db.collection("adherents")
}

else {
    let adherents = {
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
}


/**
 * Service Methods
 */