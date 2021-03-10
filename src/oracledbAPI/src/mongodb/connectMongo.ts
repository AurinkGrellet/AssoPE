import mongoose from "mongoose";
import { checkConnDatabase } from "./checkConnection";

/**
 * Met en place l'unique connexion
 * @param user 
 * @param passw 
 * @param database 
 * @returns connexion à la base de données
 */
export async function connectMongo(user: string, passw: string, database: string) {
var conn: mongoose.Connection;
if (mongoose.connection.readyState != 1) {
    conn = await checkConnDatabase(user, passw, database);
}
else conn = mongoose.connection;

return conn;
}