export interface Adherents {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    adresse: string;
}
/**
 *
 * @param method POST, GET, PUT, DELETE
 * @param data
 * @param success callback function
 */
export default function performRequest(url: string, type: string, req: string | Object): Promise<Adherents | Adherents[]>;
