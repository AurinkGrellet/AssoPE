var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Variables
     */
    const BASE_URL = "http://localhost:7000";
    var res;
    /**
     *
     * @param method POST, GET, PUT, DELETE
     * @param data
     * @param success callback function
     */
    function performRequest(url, type, req) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * HTTPS request
             */
            // GET -> SELECT
            if (type == "GET") {
                // ajoute à l'URL l'adhérent à récupérer si besoin
                if (req != "") {
                    url += req.toString();
                }
                yield $.getJSON(BASE_URL + url, (data, status, xhr) => {
                    res = {
                        adherents: data,
                        statusCode: xhr.status
                    };
                });
                return res;
            }
            // POST -> INSERT && PUT -> UPDATE
            else if (type == "POST" || type == "PUT") {
                var completeUrl = BASE_URL + url;
                if (type == "PUT") {
                    var adherent = {
                        nom: req.nom,
                        prenom: req.prenom,
                        adresse: req.adresse,
                        email: req.email
                    };
                    completeUrl = BASE_URL + url + req._id;
                    req = adherent; // écrase la requête initiale avec l'adhérent
                }
                var options = {
                    method: type,
                    url: completeUrl,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(req),
                    traditional: true,
                    success: function (data, status, xhr) {
                        res = {
                            adherents: data,
                            statusCode: xhr.status
                        };
                    }
                };
                yield $.ajax(options);
                return res;
            }
            // DELETE
            else if (type == "DELETE") {
                var completeUrl = BASE_URL + url + req;
                var options = {
                    method: "DELETE",
                    url: completeUrl,
                    traditional: true,
                    success: function (data, status, xhr) {
                        res = {
                            adherents: null,
                            statusCode: xhr.status
                        };
                    }
                };
                yield $.ajax(options);
                return res;
            }
            return null;
        });
    }
    exports.default = performRequest;
});
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
//# sourceMappingURL=callApi.js.map