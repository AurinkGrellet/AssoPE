/**
 * Manque :
 * -> Réussir à lier (knockout) test.ts à la DataGrid
 * * Le bouton actuel SELECT déclenchera une fonction qui sera elle même également déclenchée automatiquement au "connected" de la page
 * * Cliquer sur une ligne remplie du tableau affiche 2 autres(!) boutons (un peu en mode drawer si possible)
 * (!)2 Boutons : UPDATE et DELETE
 *
 * A savoir que "transitionCompleted()" s'active une fois la nouvelle table chargée, ce qui pourrait avoir ses utilités
 */
define(["require", "exports", "../accUtils", "knockout", "ojs/ojmodel", "ojs/ojcollectiondataprovider", "ojs/ojknockout", "ojs/ojinputtext", "ojs/ojinputnumber", "ojs/ojbutton", "ojs/ojdatagrid", "ojs/ojformlayout", "ojs/ojdialog", "ojs/ojcollectiondataprovider"], function (require, exports, AccUtils, ko, ojmodel_1, CollectionDataProvider) {
    "use strict";
    /**
     * ViewModel Test
     */
    class TestViewModel {
        constructor() {
            // déclarations initiales
            this.serviceURL = "http://localhost:7000/api/menu/adherents";
            //grid: ojDataGrid<string, string>;
            this.grid = ko.observable();
            // initialisations Knockout
            this.AdhCol = ko.observable();
            this.dataSource = ko.observable();
            this.inputID = ko.observable();
            this.inputNom = ko.observable();
            this.inputPrenom = ko.observable();
            this.inputAdresse = ko.observable();
            this.inputEmail = ko.observable();
            this.inputTextSearchID = ko.observable();
            this.inputTextSearchNom = ko.observable();
            this.inputTextSearchPrenom = ko.observable();
            this.inputTextSearchAdresse = ko.observable();
            this.inputTextSearchEmail = ko.observable();
            this.collSearchInputs = ko.observable();
            /**
             * Définit les noms d'attributs à utiliser pour les données reçues de l'API
             * @param response objet à formater
             * @returns objet formaté
             */
            this.parseAdh = (response) => {
                if (response == undefined) {
                    this.reset();
                    return null;
                }
                return {
                    ID: response["_id"],
                    Nom: response["nom"],
                    Prénom: response["prenom"],
                    Adresse: response["adresse"],
                    Email: response["email"]
                };
            };
            /**
             * Définit les noms d'attributs à utiliser pour les requêtes
             * @param response objet à formater
             * @returns objet formaté
             */
            this.parseSaveAdh = (response) => {
                return {
                    _id: response["_id"],
                    nom: response["nom"],
                    prenom: response["prenom"],
                    adresse: response["adresse"],
                    email: response["email"]
                };
            };
            /**
             * Modèle utilisé par l'application
             */
            this.Adherent = ojmodel_1.Model.extend({
                parse: this.parseAdh,
                parseSave: this.parseSaveAdh,
                idAttribute: "_id",
            });
            this.myAdh = new this.Adherent();
            /**
             * Collection utilisée par l'application
             */
            this.AdhCollection = ojmodel_1.Collection.extend({
                url: this.serviceURL,
                model: this.myAdh,
                comparator: "_id",
            });
            /**
             * Crée un objet Adherent avec les attributs dans la vue
             * @returns objet Adherent correspondant
             */
            this.buildModel = function (type) {
                var id;
                if (this.inputID() == null)
                    id = this.nextId;
                else
                    id = this.inputID();
                let model = {
                    "_id": id,
                    "prenom": this.inputPrenom(),
                    "nom": this.inputNom(),
                    "adresse": this.inputAdresse(),
                    "email": this.inputEmail()
                };
                if (this.checkModel(model, type)) {
                    return model;
                }
                else
                    return null;
            };
            /**
             * Affiche dans la vue les attributs de l'adhérent passé en paramètre
             * @param model adhérent à afficher
             */
            this.updateFields = function (model) {
                let attributes = model.attributes;
                this.inputID(attributes['ID']);
                this.inputPrenom(attributes['Prénom']);
                this.inputNom(attributes['Nom']);
                this.inputAdresse(attributes['Adresse']);
                this.inputEmail(attributes['Email']);
            }.bind(this);
            /**
             * Renvoie true si l'id fourni n'est pas déjà utilisé par un Model, false sinon
             * @param models collection des Adhérents
             * @param id id à tester
             */
            this.checkIds = function (models, id) {
                var dejaPresent = false;
                models.forEach((model) => {
                    if (model.attributes['ID'] === id) {
                        dejaPresent = true;
                    }
                });
                return !dejaPresent;
            };
            /**
             * Événements
             */
            /**
             * Crée et ajoute un nouvel adhérent à partir des valeurs récupérées dans la vue
             */
            this.ajout = function () {
                let model = this.buildModel("ajout");
                if (model != null) {
                    this.resetDataSource();
                    this.AdhCol().create(model, {
                        wait: true,
                        sort: true,
                        contentType: "application/json",
                        success: (model, response) => {
                            this.nextId++;
                            this.AdhCol().fetch({
                                success: (collection) => {
                                    let models = collection.models;
                                    this.nextId = models[models.length - 1].attributes["ID"] + 1;
                                    this.inputID(this.nextId);
                                }
                            });
                        },
                        error: (jqXHR, textStatus, errorThrown) => {
                            console.error("Erreur " + jqXHR.statusText + " dans la requête d'ajout : " + textStatus + "  " + errorThrown);
                        }
                    });
                }
            }.bind(this);
            /**
             * Envoie une requête PUT pour mettre à jour l'adhérent sélectionné,
             * en utilisant les valeurs récupérées dans la vue.
             */
            this.update = function () {
                this.resetDataSource();
                let collection = this.dataSource().collection;
                if (this.inputID() != null) {
                    // récupère le modèle correspondant à l'ID dans la vue
                    let model = collection.models[this.grid().selection[0].startIndex.row];
                    if (model) {
                        model.customURL = (param0, param1, param2) => { return { url: this.serviceURL + "/" + model.attributes["ID"], type: "PUT" }; };
                        let nouveauAdherent = this.buildModel("update");
                        if (nouveauAdherent) {
                            model.save({
                                nom: nouveauAdherent.nom,
                                prenom: nouveauAdherent.prenom,
                                adresse: nouveauAdherent.adresse,
                                email: nouveauAdherent.email
                            }, {
                                success: (modelBrut, response, options) => { },
                                error: (modelBrut, error, options, xhr, textStatus) => {
                                    alert("La mise à jour a échoué ; " + textStatus + " " + xhr.status);
                                }
                            });
                        }
                    }
                }
            }.bind(this);
            /**
             * Supprime l'adhérent sélectionné et met à jour nextId.
             */
            this.remove = function () {
                document.getElementById("suppressionDialog").open();
            };
            /**
             * Rafraîchit les données et réinitialise les objets graphiques
             */
            this.reset = function () {
                this.resetDataSource();
                this.dataSource(this.collection);
                this.AdhCol().fetch({
                    success: (collection) => {
                        let models = collection.models;
                        this.nextId = models[models.length - 1].attributes["ID"] + 1;
                        this.inputID(this.nextId);
                        // après le fetch pour éviter que critereChange lance une série de GET
                        this.inputTextSearchID(null);
                        this.inputTextSearchNom('');
                        this.inputTextSearchPrenom('');
                        this.inputTextSearchAdresse('');
                        this.inputTextSearchEmail('');
                    }
                });
                this.inputPrenom('');
                this.inputNom('');
                this.inputAdresse('');
                this.inputEmail('');
            }.bind(this);
            /**
             * Événement sur les éléments oj-input-text pour les critères
             * Met à jour la collection pour n'afficher que les modèles correspondant aux critères
             */
            this.critereChange = function (valeur) {
                // récupère tous les modèles
                let data = this.collection;
                // filtre les modèles ne correspondant pas aux critères
                let filtres = this.filtresActifs();
                if (filtres.length > 0) {
                    let modelsCumul = data.collection.models;
                    for (let k = 0; k < filtres.length; k++) {
                        if (filtres[k].valeur || (filtres[k].filtre == "ID" && filtres[k].valeur == "0")) {
                            let critere = filtres[k].filtre;
                            modelsCumul = (modelsCumul.filter((x) => {
                                if (x.attributes[critere].toString().length >= filtres[k].valeur.toString().length) {
                                    let found = x.attributes[critere].toString().search(filtres[k].valeur);
                                    if (found != -1)
                                        return true;
                                }
                                return false;
                            }));
                        }
                    }
                    let coll = new ojmodel_1.Collection(modelsCumul);
                    this.AdhCol(coll);
                    let datasource = new CollectionDataProvider(coll);
                    this.dataSource(datasource);
                }
                else {
                    this.dataSource(data);
                }
                let grid = this.grid();
                if (grid.selection[0] && this.inputID()) {
                    let data = this.dataSource();
                    let index = data.collection.models.findIndex((x) => {
                        if (x.attributes["ID"] == this.inputID())
                            return true;
                        else
                            return false;
                    });
                    if (index > -1) {
                        grid.selection[0].startIndex.row = index;
                        grid.selection[0].endIndex.row = index;
                    }
                }
            }.bind(this);
            this.deleteAdh = function () {
                let collection = this.dataSource();
                if (this.inputID() != null) {
                    // récupère le modèle depuis la grille
                    let grid = this.grid();
                    let index = grid.selection[0].startIndex.row;
                    let model = collection.collection.models[index];
                    if (model) {
                        model.customURL = (param0, param1, param2) => { return { url: this.serviceURL + "/" + model.attributes["ID"], type: "DELETE" }; };
                        model.fetch({
                            success: () => { document.getElementById("suppressionDialog").close(); },
                            error: (model, error, options, xhr, status) => {
                                alert("La suppression a échoué : " + xhr.status);
                                document.getElementById("suppressionDialog").close();
                            }
                        });
                    }
                }
            }.bind(this);
            this.AdhCol(new this.AdhCollection());
            this.collection = new CollectionDataProvider(this.AdhCol());
            this.dataSource(this.collection);
        }
        /**
         * Vérifie si toutes les propriétés du modèle passé en paramètre sont conformes
         * @param model modèle à tester
         * @returns true si le modèle est conforme
         */
        checkModel(model, type) {
            let OK = false;
            if ((model.nom != ("" || undefined) && model.prenom != ("" || undefined) && model.adresse != ("" || undefined) && model.email != ("" || undefined))
                && (this.checkIds(this.collection.collection.models, model._id) || type != "ajout")) {
                OK = true;
            }
            return OK;
        }
        /**
         * Retourne un vecteur contenant les filtres utilisés
         */
        filtresActifs() {
            let filtres = [{ filtre: "ID", valeur: this.inputTextSearchID() }, { filtre: "Nom", valeur: this.inputTextSearchNom() },
                { filtre: "Prénom", valeur: this.inputTextSearchPrenom() }, { filtre: "Adresse", valeur: this.inputTextSearchAdresse() },
                { filtre: "Email", valeur: this.inputTextSearchEmail() }];
            // retire les espaces en début et fin de critères de recherche
            console.info(filtres);
            /*
            this.inputTextSearchNom(filtres[1].valeur.trim());
            this.inputTextSearchPrenom(filtres[2].valeur.trim());
            this.inputTextSearchAdresse(filtres[3].valeur.trim());
            this.inputTextSearchEmail(filtres[4].valeur.trim());
            */
            // boucle retirant les critères vides du vecteur
            for (let k = filtres.length - 1; k >= 0; k--) {
                if ((filtres[k].valeur == "" || !filtres[k].valeur)
                    && !(filtres[k].filtre == "ID" && filtres[k].valeur == 0)) {
                    console.info(filtres[k]);
                    let index = filtres.indexOf(filtres[k]);
                    if (index > -1) {
                        filtres.splice(index, 1);
                    }
                }
            }
            ;
            return filtres;
        }
        /**
         * Réinitialise AdhCol à sa valeur par défaut si un filtre est actif
         */
        resetDataSource() {
            if (this.AdhCol().models.length < this.collection.collection.models.length) {
                this.AdhCol(new this.AdhCollection());
            }
        }
        /**
         * Envoie une requête GET à la base de données
         */
        fetchDataSource() {
            this.resetDataSource();
            this.AdhCol().fetch({
                success: (collection) => {
                    let models = collection.models;
                    this.nextId = models[models.length - 1].attributes["ID"] + 1;
                }
            });
        }
        /**
         * Referme l'objet ojDialog
         */
        cancelDialog() {
            document.getElementById("suppressionDialog").close();
            return true;
        }
        ;
        /**
         * Renvoie la largeur des colonnes à afficher.
         * @param headerContext Contexte de l'entête.
         */
        getHeaderClassName(headerContext) {
            var key = headerContext.key;
            switch (key) {
                case "ID": return 'width:74px';
                case "Nom": return 'width:118px';
                case "Prénom": return 'width:118px';
                case "Adresse": return 'width:280px';
                case "Email": return 'width:222px';
            }
            return "width:200px";
        }
        /**
         * Événement JET qui se déclenche à chaque connexion.
         */
        connected() {
            AccUtils.announce("Test page loaded.");
            document.title = "Test";
            this.grid(document.getElementById("datagrid"));
            /**
             * Événements de la vue
             */
            // Affiche les données de l'adhérent dans le texte à droite
            this.grid().addEventListener('selectionChanged', function (event) {
                //on selection change update fields with the selected model
                var selection = event.detail.value[0];
                if (selection != null) {
                    var rowKey = selection.startIndex.row;
                    this.modelToUpdate = this.dataSource().collection.models[rowKey];
                    this.updateFields(this.modelToUpdate);
                }
            }.bind(this));
        }
        /**
         * Événement JET qui se déclenche à chaque déconnexion.
         */
        disconnected() {
        }
        /**
         * Événement JET qui se déclenche après la transition à la nouvelle vue.
         */
        transitionCompleted() {
        }
    }
    return TestViewModel;
});
//# sourceMappingURL=test.js.map