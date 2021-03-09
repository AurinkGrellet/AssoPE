/**
 * Manque :
 * -> Réussir à lier (knockout) test.ts à la DataGrid
 * * Le bouton actuel SELECT déclenchera une fonction qui sera elle même également déclenchée automatiquement au "connected" de la page
 * * Cliquer sur une ligne remplie du tableau affiche 2 autres(!) boutons (un peu en mode drawer si possible)
 * (!)2 Boutons : UPDATE et DELETE
 *
 * A savoir que "transitionCompleted()" s'active une fois la nouvelle table chargée, ce qui pourrait avoir ses utilités
 */

import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import * as KnockoutUtils from "ojs/ojknockout-model";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojinputnumber";
import "ojs/ojbutton";
import "ojs/ojdatagrid";
import "ojs/ojformlayout";
import "ojs/ojdialog";
import "ojs/ojcollectiondataprovider"
import { ojButton } from "ojs/ojbutton";
import { ojDataGrid } from "ojs/ojdatagrid";
import { Model, Collection } from "ojs/ojmodel";
import CollectionDataProvider = require("ojs/ojcollectiondataprovider");
import { ojDialog } from "ojs/ojdialog";
import { ojInputText } from "ojs/ojinputtext";


/**
 * Interfaces
 */
interface BaseAdherent {
    nom: string,
    prenom: string,
    email: string,
    adresse: string
}

interface Adherent extends BaseAdherent {
    _id: number
}

interface AdherentVue {
    ID: number,
    Nom: string,
    Prénom: string,
    Email: string,
    Adresse: string
}

interface Filtre {
    filtre: string | number,
    valeur: string
}

/**
 * ViewModel Test
 */
class TestViewModel {
    // déclarations initiales
    private readonly serviceURL: string = "http://localhost:7000/api/menu/adherents";
    //grid: ojDataGrid<string, string>;
    grid: ko.Observable = ko.observable();
    collection: CollectionDataProvider<string, string>;
    modelToUpdate: Model;
    nextId: number;
    gridtimeoutfill: number = 150; // délai avant chargement des données

    // initialisations Knockout
    private AdhCol: ko.Observable = ko.observable();
    dataSource: ko.Observable = ko.observable();
    inputID: ko.Observable = ko.observable();
    inputNom: ko.Observable = ko.observable();
    inputPrenom: ko.Observable = ko.observable();
    inputAdresse: ko.Observable = ko.observable();
    inputEmail: ko.Observable = ko.observable();
    inputTextSearchID: ko.Observable = ko.observable();
    inputTextSearchNom: ko.Observable = ko.observable();
    inputTextSearchPrenom: ko.Observable = ko.observable();
    inputTextSearchAdresse: ko.Observable = ko.observable();
    inputTextSearchEmail: ko.Observable = ko.observable();
    collSearchInputs: ko.Observable = ko.observable();

    /**
     * Définit les noms d'attributs à utiliser pour les données reçues de l'API
     * @param response objet à formater
     * @returns objet formaté
     */
    private parseAdh = (response: {
        ID: number;
        Nom: string;
        Prénom: string;
        Adresse: string;
        Email: string;
    }): AdherentVue => {
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
    private parseSaveAdh = (response: {
        _id: number;
        nom: string;
        prenom: string;
        adresse: string;
        email: string;
    }): Adherent => {
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
    private Adherent = Model.extend({
        parse: this.parseAdh,
        parseSave: this.parseSaveAdh,
        idAttribute: "_id",
    });
    private myAdh: Model = new this.Adherent();

    /**
     * Collection utilisée par l'application
     */
    private AdhCollection = Collection.extend({
        url: this.serviceURL,
        model: this.myAdh,
        comparator: "_id",
    });

    /**
     * Crée un objet Adherent avec les attributs dans la vue
     * @returns objet Adherent correspondant
     */
    buildModel = function (type: string): Adherent {
        var id: number;
        if (this.inputID() == null) id = this.nextId;
        else id = this.inputID();
        let model: Adherent = {
            "_id": id,
            "prenom": this.inputPrenom(),
            "nom": this.inputNom(),
            "adresse": this.inputAdresse(),
            "email": this.inputEmail()
        }

        if (this.checkModel(model, type)) {
            return model;
        }
        else return null;
    };

    /**
     * Affiche dans la vue les attributs de l'adhérent passé en paramètre
     * @param model adhérent à afficher
     */
    updateFields = function (model: Model) {
        let attributes: BaseAdherent = model.attributes as BaseAdherent;
        this.inputID(attributes['ID'])
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
    checkIds = function (models: Model[], id: number): boolean {
        var dejaPresent = false;
        models.forEach((model: Model) => {
            if (model.attributes['ID'] === id) {
                dejaPresent = true;
            }
        });
        return !dejaPresent;
    }

    /**
     * Vérifie si toutes les propriétés du modèle passé en paramètre sont conformes
     * @param model modèle à tester
     * @returns true si le modèle est conforme
     */
    checkModel(model: Adherent, type: string): boolean {
        let OK: boolean = false;
        if ((model.nom != ("" || undefined) && model.prenom != ("" || undefined) && model.adresse != ("" || undefined) && model.email != ("" || undefined))
            && (this.checkIds((this.collection as any).collection.models, model._id) || type != "ajout")) {
            OK = true;
        }

        return OK;
    }


    /**
     * Événements
     */

    /**
     * Crée et ajoute un nouvel adhérent à partir des valeurs récupérées dans la vue
     */
    ajout = function () {
        let model: Adherent = this.buildModel("ajout");
        if (model != null) {
            this.resetDataSource();
            (this.AdhCol() as Collection).create(model, {
                wait: true,
                sort: true,
                contentType: "application/json",
                success: (model, response) => {
                    this.nextId++;
                    (this.AdhCol() as Collection).fetch({
                        success: (collection) => {
                            let models = collection.models;
                            this.nextId = (models[models.length - 1].attributes["ID"] as number) + 1;
                            this.inputID(this.nextId);
                        }
                    });
                },
                error: (jqXHR: JQuery.jqXHR, textStatus: JQuery.Ajax.ErrorTextStatus, errorThrown) => {
                    console.error("Erreur " + jqXHR.statusText + " dans la requête d'ajout : " + textStatus + "  " + errorThrown)
                }
            });
        }
    }.bind(this);


    /**
     * Envoie une requête PUT pour mettre à jour l'adhérent sélectionné, 
     * en utilisant les valeurs récupérées dans la vue.
     */
    update = function () {
        this.resetDataSource();
        let collection: Collection = this.dataSource().collection;

        if (this.inputID() != null) {
            // récupère le modèle correspondant à l'ID dans la vue
            let model = collection.models[this.grid().selection[0].startIndex.row];

            if (model) {
                model.customURL = (param0, param1, param2) => { return { url: this.serviceURL + "/" + model.attributes["ID"], type: "PUT" } };
                let nouveauAdherent: Adherent = this.buildModel("update");
                if (nouveauAdherent) {
                    (model as Model).save(
                        {
                            nom: nouveauAdherent.nom,
                            prenom: nouveauAdherent.prenom,
                            adresse: nouveauAdherent.adresse,
                            email: nouveauAdherent.email
                        },
                        {
                            success: (modelBrut: Model, response, options) => { },
                            error: (modelBrut, error, options, xhr: JQuery.jqXHR, textStatus: string) => {
                                alert("La mise à jour a échoué ; " + textStatus + " " + xhr.status);
                            }
                        }
                    )
                }
            }
        }
    }.bind(this);


    /** 
     * Supprime l'adhérent sélectionné et met à jour nextId.
     */
    remove = function () {
        (document.getElementById("suppressionDialog") as ojDialog).open();
    };


    /**
     * Rafraîchit les données et réinitialise les objets graphiques
     */
    reset = function () {
        this.resetDataSource();
        this.dataSource(this.collection);

        (this.AdhCol() as Collection).fetch({
            success: (collection) => {
                let models = collection.models;
                this.nextId = (models[models.length - 1].attributes["ID"] as number) + 1;
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
    critereChange = function (valeur: string) {
        // récupère tous les modèles
        let data = this.collection;

        // filtre les modèles ne correspondant pas aux critères
        let filtres: Filtre[] = this.filtresActifs();
        if (filtres.length > 0) {
            let modelsCumul: Model[] = data.collection.models;
            for (let k = 0; k < filtres.length; k++) {
                if (filtres[k].valeur) {
                    let critere = filtres[k].filtre;
                    modelsCumul = (modelsCumul.filter((x: Model) => {
                        if (x.attributes[critere].toString().length >= filtres[k].valeur.toString().length) {
                            let found = (x.attributes as AdherentVue)[critere].toString().search(filtres[k].valeur);
                            if (found != -1) return true;
                        }
                        return false;
                    }));
                }
            }
            let coll = new Collection(modelsCumul);
            this.AdhCol(coll);
            let datasource = new CollectionDataProvider<string, string>(coll);
            this.dataSource(datasource);
        }
        else {
            this.dataSource(data);
        }

        let grid = (this.grid() as ojDataGrid<string, string>);
        if (grid.selection[0] && this.inputID()) {
            let data = this.dataSource();
            let index: number = (data.collection.models as Model[]).findIndex((x: Model) => {
                if (x.attributes["ID"] == this.inputID()) return true;
                else return false;
            });

            if (index > -1) {
                grid.selection[0].startIndex.row = index;
                grid.selection[0].endIndex.row = index;
            }
        }
    }.bind(this);


    /**
     * Retourne un vecteur contenant les filtres utilisés
     */
    filtresActifs(): Filtre[] {
        let filtres: Filtre[] = [{ filtre: "ID", valeur: this.inputTextSearchID() }, { filtre: "Nom", valeur: this.inputTextSearchNom() },
        { filtre: "Prénom", valeur: this.inputTextSearchPrenom() }, { filtre: "Adresse", valeur: this.inputTextSearchAdresse() },
        { filtre: "Email", valeur: this.inputTextSearchEmail() }];
        for (let k = filtres.length - 1; k >= 0; k--) {
            if (filtres[k].valeur == "" || !filtres[k].valeur) {
                let index = filtres.indexOf(filtres[k]);
                if (index > -1) {
                    filtres.splice(index, 1);
                }
            }
        };
        return filtres;
    }


    /**
     * Réinitialise AdhCol à sa valeur par défaut si un filtre est actif
     */
    resetDataSource() {
        if (this.AdhCol().models.length < (this.collection as any).collection.models.length) {
            this.AdhCol(new this.AdhCollection());
        }
    }


    /**
     * Envoie une requête GET à la base de données
     */
    fetchDataSource() {
        this.resetDataSource();
        (this.AdhCol() as Collection).fetch({
            success: (collection) => {
                let models = collection.models;
                this.nextId = (models[models.length - 1].attributes["ID"] as number) + 1;
            }
        });
    }


    /**
     * Referme l'objet ojDialog
     */
    cancelDialog() {
        (document.getElementById("suppressionDialog") as ojDialog).close();
        return true;
    };


    deleteAdh = function () {
        let collection: any = this.dataSource();

        if (this.inputID() != null) {
            // récupère le modèle depuis la grille
            let grid = (this.grid() as ojDataGrid<string, string>);
            let index = grid.selection[0].startIndex.row;
            let model = collection.collection.models[index];

            if (model) {
                model.customURL = (param0, param1, param2) => { return { url: this.serviceURL + "/" + model.attributes["ID"], type: "DELETE" } };
                (model as Model).fetch(
                    {
                        success: () => { (document.getElementById("suppressionDialog") as ojDialog).close(); },
                        error: (model, error, options, xhr: JQuery.jqXHR, status) => {
                            alert("La suppression a échoué : " + xhr.status);
                            (document.getElementById("suppressionDialog") as ojDialog).close();
                        }
                    }
                )
            }
        }
    }.bind(this);


    /**
     * Renvoie la largeur des colonnes à afficher. 
     * @param headerContext Contexte de l'entête.
     */
    getHeaderClassName(headerContext: ojDataGrid.HeaderContext<string, string>) {
        var key = headerContext.key;

        switch (key) {
            case "ID": return 'width:74px'
            case "Nom": return 'width:118px'
            case "Prénom": return 'width:118px'
            case "Adresse": return 'width:280px'
            case "Email": return 'width:222px'
        }

        return "width:200px";
    }


    constructor() {
        this.AdhCol(new this.AdhCollection());
        this.collection = new CollectionDataProvider(this.AdhCol());
        // ajoute un délai avant l'ajout des données, nécessaire de refresh manuellement sinon
        setTimeout(() => {
            let x: number = (this.collection as any).collection.models.length;
            setTimeout(() => {
                this.dataSource(this.collection);
            }, 50 + x);
        }, this.gridtimeoutfill);
    }



    /**
     * Événement JET qui se déclenche à chaque connexion.
     */
    connected(): void {
        AccUtils.announce("Test page loaded.");
        document.title = "Test";

        this.grid(document.getElementById("datagrid") as ojDataGrid<string, string>);

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
    disconnected(): void {
    }

    /**
     * Événement JET qui se déclenche après la transition à la nouvelle vue.
     */
    transitionCompleted(): void {
    }
}

export = TestViewModel;