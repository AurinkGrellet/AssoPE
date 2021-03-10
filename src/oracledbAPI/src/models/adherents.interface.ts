import { Adherent } from "./adherent.interface";

/**
 * Interface utilisée pour les collections d'adhérents
 */
export interface Adherents {
    [key: number]: Adherent;
}