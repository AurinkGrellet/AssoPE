import mongoose from "mongoose";
import { checkConnDatabase } from "./checkConnection";

export async function connectMongo(user: string, passw: string, database: string) {
/**
 * Setting up the only connection
 */
var conn: mongoose.Connection;
if (mongoose.connection.readyState != 1) {
    conn = await checkConnDatabase(user, passw, database);
}
else conn = mongoose.connection;

return conn;
}