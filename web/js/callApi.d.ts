interface BaseAdherent {
    nom: string;
    prenom: string;
    email: string;
    adresse: string;
}
interface Adherents extends BaseAdherent {
    _id: string;
}
export interface webRequest {
    adherents: Adherents | Adherents[];
    statusCode: number;
}
/**
 *
 * @param method POST, GET, PUT, DELETE
 * @param data
 * @param success callback function
 */
export default function performRequest(url: string, type: string, req: string | BaseAdherent | Adherents): Promise<webRequest>;
