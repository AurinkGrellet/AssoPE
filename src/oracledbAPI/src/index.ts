/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as dbaccess from "./mongodb/control";
import { adherentsRouter } from "./models/adherents.router";

dotenv.config();

/**
 * App Variables
 */
if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);
const PASSW: string = process.env.PASSW as string;

const app = express();

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/menu/adherents", adherentsRouter);


/**
 * Server Activation
 */
app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
    await dbaccess.control(PASSW); // crée un objet "connection"
});