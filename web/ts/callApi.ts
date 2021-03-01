/**
 * Variables
 */
const BASE_URL: string = "http://localhost:7000";

var res: webRequest;

interface BaseAdherent {
    nom: string,
    prenom: string,
    email: string,
    adresse: string
}

interface Adherents extends BaseAdherent {
    _id: string
}

export interface webRequest {
    adherents: Adherents | Adherents[],
    statusCode: number
}

/**
 * 
 * @param method POST, GET, PUT, DELETE
 * @param data 
 * @param success callback function
 */
export default async function performRequest(url: string, type: string, req: string | BaseAdherent | Adherents): Promise<webRequest> {
    /**
     * HTTPS request
     */

    // GET -> SELECT
    if (type == "GET") {
        // ajoute à l'URL l'adhérent à récupérer si besoin
        if (req as string != "") {
            url += req.toString();
        }

        await $.getJSON(BASE_URL + url, (data: Adherents | Adherents[], status, xhr) => {
            res = {
                adherents: data,
                statusCode: xhr.status
            }
        });
        
        return res;
    }

    // POST -> INSERT && PUT -> UPDATE
    else if (type == "POST" || type == "PUT") {
        var completeUrl = BASE_URL + url;

        if (type == "PUT") {
            var adherent: BaseAdherent = {
                nom: (req as Adherents).nom,
                prenom: (req as Adherents).prenom,
                adresse: (req as Adherents).adresse,
                email: (req as Adherents).email
            }
            completeUrl = BASE_URL + url + (req as Adherents)._id;
            req = adherent; // écrase la requête initiale avec l'adhérent
        }

        var options: JQueryAjaxSettings = {
            method: type,
            url: completeUrl,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(req),
            traditional: true,
            success: function (data, status, xhr) {
                res = {
                    adherents: data,
                    statusCode: xhr.status
                }
            }
        }

        await $.ajax(options);

        return res;
    }

    // DELETE
    else if (type == "DELETE") {
        var completeUrl = BASE_URL + url + req as string;

        var options: JQueryAjaxSettings = {
            method: "DELETE",
            url: completeUrl,
            traditional: true,
            success: function (data, status, xhr) {
                res = {
                    adherents: null,
                    statusCode: xhr.status
                }
            }
        };

        await $.ajax(options);

        return res;
    }

    return null;
}