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
    /**
     *
     * @param method POST, GET, PUT, DELETE
     * @param data
     * @param success callback function
     */
    function performRequest(url, type, req) {
        return __awaiter(this, void 0, void 0, function* () {
            // ajoute l'adhérent à récupérer à l'URL
            if (type == "GET" && req != "") {
                url += req.toString();
            }
            /**
             * HTTPS request
             */
            // GET -> SELECT
            if (type == "GET") {
                var datares;
                yield $.getJSON(BASE_URL + url, (data) => {
                    // SELECT * (data est un vecteur)
                    if (data[0]) {
                        console.log(data[1].adresse);
                    }
                    else {
                        console.log(data.adresse);
                    }
                    datares = data;
                });
                return datares;
            }
            // POST -> INSERT
            else if (type == "POST") {
                // somehow create the request from params & UrlAjaxSettings as a type? => read same url as ^
                $.post();
            }
            // PUT/DELETE -> UPDATE/DELETE
            else {
                var options = {
                    url: BASE_URL + url,
                    type: type,
                    success: () => { console.log("SUCCESS"); }
                };
                $.ajax(options);
            }
            return null;
        });
    }
    exports.default = performRequest;
});
//# sourceMappingURL=callApi.js.map