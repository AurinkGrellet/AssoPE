/**
 * Variables
 */
const BASE_URL: string = "http://localhost:7000";

export interface Adherents {
    _id: string,
    nom: string,
    prenom: string,
    email: string,
    adresse: string
}

/**
 * 
 * @param method POST, GET, PUT, DELETE
 * @param data 
 * @param success callback function
 */
export default async function performRequest(url: string, type: string, req: string | Object): Promise<Adherents | Adherents[]> {
    // ajoute l'adhérent à récupérer à l'URL
    if (type == "GET" && req as string != "") {
        url += req.toString();
    }

    /**
     * HTTPS request
     */

    // GET -> SELECT

    if (type == "GET") {
        var res: Adherents | Adherents[];
        await $.getJSON(BASE_URL + url, (data: Adherents | Adherents[]) => {
            // SELECT * (data est un vecteur)
            if (data[0]) {
                console.log(data[1].adresse);
            }
            
            else {
                console.log((data as Adherents).adresse);
            }
            res = data;
        });
        return res;
    }

    // POST -> INSERT
    else if (type == "POST") {
        // somehow create the request from params & UrlAjaxSettings as a type? => read same url as ^
        $.post()
    }

    // PUT/DELETE -> UPDATE/DELETE
    else {
        var options: JQueryAjaxSettings = {
            url: BASE_URL + url,
            type: type,
            success: () => {console.log("SUCCESS");}
        };

        $.ajax(options);
    }

    return null;
}