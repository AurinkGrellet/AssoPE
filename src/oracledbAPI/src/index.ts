/**
 * Modules externes requis
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as dbaccess from "./mongodb/connectMongo";
import { adherentsRouter } from "./models/adherents.router";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";

dotenv.config();

/**
 * Variables globales
 */
if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const PASSW: string = process.env.PASSW as string;
const USER: string = process.env.USER as string;
const DATABASE: string = process.env.DATABASE as string;

const app = express();

/**
 * Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/menu/adherents", adherentsRouter);

app.use(errorHandler);
app.use(notFoundHandler); // catches all errors uncatched by the errorHandler


/**
 * Activation du serveur
 */
app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
    await dbaccess.connectMongo(USER, PASSW, DATABASE); // crée un objet "connection"
});