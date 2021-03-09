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
/*** EXEMPLES D'UTILISATION DEPUIS L'IMPORT ***
                // GET test (changer "" par un nombre pour récupérer un adhérent précis)
                let resGet = callApi("/api/menu/adherents/", "GET", "");
                resGet.then((value) => {
                    console.log(value.statusCode);
                    // "value" contient le résultat de la requête
                });
                // POST test
                let resPost = callApi("/api/menu/adherents/", "POST", {nom: "Dupont", prenom: "Richard", adresse: "238 Rue Kleber - 93000 Toulon", email: "richard.dupont@hotmail.com"});
                resPost.then((value) => {
                    console.log(value.statusCode);
                    // contient le nouvel adhérent + status
                });
                // PUT test
                let resPut = callApi("/api/menu/adherents/", "PUT", {_id:"5", nom: "Dupont", prenom:"Richard", adresse:"237 Rue Kleber - 93000 Toulon", email:"richard.dupont@hotmail.com"});
                resPut.then((value) => {
                    console.log(value.statusCode);
                    // contient l'adhérent mis à jour + status
                });
                // DELETE test
                let resDel = callApi("/api/menu/adherents/", "DELETE", "6");
                resDel.then((value) => {
                    console.log(value.statusCode);
                    // contient le status
                });
        */ 
