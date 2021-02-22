import mongoose from "mongoose";
import { checkConnDatabase } from "./checkConnection";
import { Collection } from "mongodb";

export async function control(PASSW: string) {
/**
 * Setting up the only connection
 */
var conn: mongoose.Connection = await checkConnDatabase(PASSW);
    
// Mongoose SELECT exemple avec .find
var collection: Collection = conn.db.collection("adherents");
var e = collection.find();
console.log(await e.toArray());

return conn;

/**
 * Control functions
 */


}