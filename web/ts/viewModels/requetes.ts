/**
 * @author Aurink GRELLET
 * ViewModel de l'application simple de requêtes CRUD + Recherche
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
import { GridFSBucket } from "mongodb";
import { register } from "@oracle/oraclejet/dist/types/ojcomposite";


/** Interfaces **/

/**
 * Attributs de base d'un adhérent
 */
interface BaseAdherent {
    nom: string,
    prenom: string,
    email: string,
    adresse: string
}

/**
 * Attributs complets d'un adhérent
 */
interface Adherent extends BaseAdherent {
    _id: number
}

/**
 * Attributs d'un adhérent tels qu'affichés dans la vue
 */
interface AdherentVue {
    ID: number,
    Nom: string,
    Prénom: string,
    Email: string,
    Adresse: string
}

/**
 * Critère de recherche
 */
interface Critere {
    critere: string,
    valeur: string | number
}

/**
 * ViewModel Requetes
 */
class RequetesViewModel {
    // déclarations initiales
    private readonly serviceURL: string = "http://localhost:7000/api/menu/adherents";
    //grid: ojDataGrid<string, string>;
    grid: ko.Observable = ko.observable();
    collection: CollectionDataProvider<string, string>; // collection d'adhérents complète
    nextId: number;

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
     * Définit les attributs à utiliser pour afficher les données reçues de l'API
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
     * Définit les attributs à utiliser pour les requêtes
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
     * Modèle des adhérents
     */
    private Adherent = Model.extend({
        parse: this.parseAdh,
        parseSave: this.parseSaveAdh,
        idAttribute: "_id",
    });
    private myAdh: Model = new this.Adherent();

    /**
     * Collection connectée à l'API
     */
    private AdhCollection = Collection.extend({
        url: this.serviceURL,
        model: this.myAdh,
        comparator: "_id",
    });

    /**
     * Crée un objet Adherent avec les valeurs saisies dans la vue
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
     * Affiche dans les saisies de texte les attributs de l'adhérent passé en paramètre
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
     * Recherche dans le vecteur de modèles l'id passé en paramètre
     * @param models collection des Adhérents
     * @param id id à tester
     * @returns true si l'id fourni n'est pas déjà utilisé par un Model, false sinon
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
     * @returns true si le modèle est complet, false sinon
     */
    checkModel(model: Adherent, type: string): boolean {
        let OK: boolean = false;
        if ((model.nom != ("" || undefined) && model.prenom != ("" || undefined) && model.adresse != ("" || undefined) && model.email != ("" || undefined))
            && (this.checkIds((this.collection as any).collection.models, model._id) || type != "ajout")) {
            OK = true;
        }

        return OK;
    }


    /** Événements **/

    /**
     * Crée et ajoute un nouvel adhérent à partir des valeurs saisies dans la vue
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

                            // réinitialise le DataSource si aucun filtre actif
                            if (this.filtresActifs().length == 0) {
                                this.fetchDataSource();
                            }
                            // reprend les adhérents actuellement affichés et filtre à nouveau sinon
                            else {
                                this.collection = new CollectionDataProvider(this.AdhCol());
                                if (this.filtresActifs().length > 0) this.critereChange();
                            }
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
     * en utilisant les valeurs saisies dans la vue
     */
    update = function () {
        this.resetDataSource();
        let collection: Collection = this.dataSource().collection;

        if (this.inputID() != null) {
            // récupère le modèle sélectionné
            let model = collection.models[this.grid().selection[0].startIndex.row];

            if (model) {
                // construction de la requête PUT
                model.customURL = (param0, param1, param2) => { return { url: this.serviceURL + "/" + model.attributes["ID"], type: "PUT" } };
                let nouveauAdherent: Adherent = this.buildModel("update");
                if (nouveauAdherent) {
                    // sauvegarde des nouvelles valeurs
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
     * Ouvre une fenêtre de dialogue demandant confirmation pour la suppression de l'adhérent
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
     * Met à jour la collection pour n'afficher que les modèles correspondant aux critères
     */
    critereChange = function (valeur: string) {
        // récupère tous les modèles
        let data = this.collection;

        // filtre les modèles ne correspondant pas aux critères
        let filtres: Critere[] = this.filtresActifs();
        if (filtres.length > 0) {
            let modelsCumul: Model[] = data.collection.models;
            for (let k = 0; k < filtres.length; k++) {
                if (filtres[k].valeur || (filtres[k].critere == "ID" && filtres[k].valeur == "0")) {
                    let critere = filtres[k].critere;
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
     * @returns vecteur des filtres utilisés
     */
    filtresActifs(): Critere[] {
        let filtres: Critere[] = [{ critere: "ID", valeur: this.inputTextSearchID() }, { critere: "Nom", valeur: this.inputTextSearchNom() },
        { critere: "Prénom", valeur: this.inputTextSearchPrenom() }, { critere: "Adresse", valeur: this.inputTextSearchAdresse() },
        { critere: "Email", valeur: this.inputTextSearchEmail() }];

        // boucle retirant les critères vides du vecteur
        for (let k = filtres.length - 1; k >= 0; k--) {
            if ((filtres[k].valeur == "" || !filtres[k].valeur)
                && !(filtres[k].critere == "ID" && filtres[k].valeur == 0)) {
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
     * Met à jour collection et dataSource en envoyant une requête à l'API
     * @param type
     */
    fetchDataSource() {
        let coll = new this.AdhCollection();
        coll.fetch({
            success: (collection) => {
                let models = collection.models;
                this.nextId = (models[models.length - 1].attributes["ID"] as number) + 1;
                this.collection = new CollectionDataProvider(coll);
                this.dataSource(this.collection);

                if (this.filtresActifs().length > 0) this.critereChange();
            }
        });
    }


    /**
     * Ferme la fenêtre de dialogue de suppression d'adhérent
     */
    cancelDialog() {
        (document.getElementById("suppressionDialog") as ojDialog).close();
        return true;
    };


    /**
     * Supprime l'adhérent sélectionné, puis referme la fenêtre de dialogue
     */
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
                        success: () => {
                            this.fetchDataSource();

                            // sélectionne la première ligne par défaut
                            this.grid().selection[0].startIndex.row = 0;
                            this.grid().selection[0].endIndex.row = 0;

                            (document.getElementById("suppressionDialog") as ojDialog).close();
                        },
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
     * Renvoie la largeur des colonnes à afficher
     * @param headerContext Contexte de l'entête
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
        this.dataSource(this.collection);
        setTimeout(() => {
            this.grid().refresh();
        }, 300);
    }



    /**
     * Événement JET qui se déclenche à chaque connexion
     */
    connected(): void {
        AccUtils.announce("Requetes page loaded.");
        document.title = "Requêtes";

        this.grid(document.getElementById("datagrid") as ojDataGrid<string, string>);

        /**
         * Événements de la vue
         */

        // Affiche les données de l'adhérent dans le texte à droite
        this.grid().addEventListener('selectionChanged', function (event) {
            // met à jour les oj-input d'interaction CRUD en utilisant le modèle sélectionné
            var selection = event.detail.value[0];
            if (selection != null) {
                var rowKey = selection.startIndex.row;
                let modelToUpdate: Model = this.dataSource().collection.models[rowKey];
                this.updateFields(modelToUpdate);
            }
        }.bind(this));
    }

    /**
     * Événement JET qui se déclenche à chaque déconnexion
     */
    disconnected(): void {
    }

    /**
     * Événement JET qui se déclenche après la transition à la nouvelle vue
     */
    transitionCompleted(): void {
    }
}

export = RequetesViewModel;