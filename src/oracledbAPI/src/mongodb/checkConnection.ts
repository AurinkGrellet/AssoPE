import mongoose from "mongoose";

const connString1 = "mongodb+srv://";
const connString2 = "?retryWrites=true&w=majority";

/**
 * Crée une connexion à la base de données MongoDB, s'il n'en existe pas déjà une
 * @param pass mot de passe pour la connexion
 */
export async function checkConnDatabase(user: string, pass: string, database: string): Promise<mongoose.Connection> {
    var connOpt: mongoose.ConnectOptions = { autoIndex: true, useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }
    var connection: mongoose.Connection = mongoose.connection;
    mongoose.connect(connString1 + user + ":" + pass + database + connString2, connOpt, (err: mongoose.CallbackError) => {
        if (!err) {
            console.log("Connecté à la base MongoDB");
        }
        else {
            console.log("N'a pas pu se connecter à la base de données : " + err);
        }
    });
    return connection;
}