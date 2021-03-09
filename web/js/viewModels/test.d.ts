/**
 * Manque :
 * -> Réussir à lier (knockout) test.ts à la DataGrid
 * * Le bouton actuel SELECT déclenchera une fonction qui sera elle même également déclenchée automatiquement au "connected" de la page
 * * Cliquer sur une ligne remplie du tableau affiche 2 autres(!) boutons (un peu en mode drawer si possible)
 * (!)2 Boutons : UPDATE et DELETE
 *
 * A savoir que "transitionCompleted()" s'active une fois la nouvelle table chargée, ce qui pourrait avoir ses utilités
 */
/// <reference types="ojcollectiondataprovider" />
import * as ko from "knockout";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojinputnumber";
import "ojs/ojbutton";
import "ojs/ojdatagrid";
import "ojs/ojformlayout";
import "ojs/ojdialog";
import "ojs/ojcollectiondataprovider";
import { ojDataGrid } from "ojs/ojdatagrid";
import { Model } from "ojs/ojmodel";
import CollectionDataProvider = require("ojs/ojcollectiondataprovider");
/**
 * Interfaces
 */
interface BaseAdherent {
    nom: string;
    prenom: string;
    email: string;
    adresse: string;
}
interface Adherent extends BaseAdherent {
    _id: number;
}
interface Filtre {
    filtre: string | number;
    valeur: string;
}
/**
 * ViewModel Test
 */
declare class TestViewModel {
    private readonly serviceURL;
    grid: ko.Observable;
    collection: CollectionDataProvider<string, string>;
    modelToUpdate: Model;
    nextId: number;
    gridtimeoutfill: number;
    private AdhCol;
    dataSource: ko.Observable;
    inputID: ko.Observable;
    inputNom: ko.Observable;
    inputPrenom: ko.Observable;
    inputAdresse: ko.Observable;
    inputEmail: ko.Observable;
    inputTextSearchID: ko.Observable;
    inputTextSearchNom: ko.Observable;
    inputTextSearchPrenom: ko.Observable;
    inputTextSearchAdresse: ko.Observable;
    inputTextSearchEmail: ko.Observable;
    collSearchInputs: ko.Observable;
    /**
     * Définit les noms d'attributs à utiliser pour les données reçues de l'API
     * @param response objet à formater
     * @returns objet formaté
     */
    private parseAdh;
    /**
     * Définit les noms d'attributs à utiliser pour les requêtes
     * @param response objet à formater
     * @returns objet formaté
     */
    private parseSaveAdh;
    /**
     * Modèle utilisé par l'application
     */
    private Adherent;
    private myAdh;
    /**
     * Collection utilisée par l'application
     */
    private AdhCollection;
    /**
     * Crée un objet Adherent avec les attributs dans la vue
     * @returns objet Adherent correspondant
     */
    buildModel: (type: string) => Adherent;
    /**
     * Affiche dans la vue les attributs de l'adhérent passé en paramètre
     * @param model adhérent à afficher
     */
    updateFields: any;
    /**
     * Renvoie true si l'id fourni n'est pas déjà utilisé par un Model, false sinon
     * @param models collection des Adhérents
     * @param id id à tester
     */
    checkIds: (models: Model[], id: number) => boolean;
    /**
     * Vérifie si toutes les propriétés du modèle passé en paramètre sont conformes
     * @param model modèle à tester
     * @returns true si le modèle est conforme
     */
    checkModel(model: Adherent, type: string): boolean;
    /**
     * Événements
     */
    /**
     * Crée et ajoute un nouvel adhérent à partir des valeurs récupérées dans la vue
     */
    ajout: any;
    /**
     * Envoie une requête PUT pour mettre à jour l'adhérent sélectionné,
     * en utilisant les valeurs récupérées dans la vue.
     */
    update: any;
    /**
     * Supprime l'adhérent sélectionné et met à jour nextId.
     */
    remove: () => void;
    /**
     * Rafraîchit les données et réinitialise les objets graphiques
     */
    reset: any;
    /**
     * Événement sur les éléments oj-input-text pour les critères
     * Met à jour la collection pour n'afficher que les modèles correspondant aux critères
     */
    critereChange: any;
    /**
     * Retourne un vecteur contenant les filtres utilisés
     */
    filtresActifs(): Filtre[];
    /**
     * Réinitialise AdhCol à sa valeur par défaut si un filtre est actif
     */
    resetDataSource(): void;
    /**
     * Envoie une requête GET à la base de données
     */
    fetchDataSource(): void;
    /**
     * Referme l'objet ojDialog
     */
    cancelDialog(): boolean;
    deleteAdh: any;
    /**
     * Renvoie la largeur des colonnes à afficher.
     * @param headerContext Contexte de l'entête.
     */
    getHeaderClassName(headerContext: ojDataGrid.HeaderContext<string, string>): "width:74px" | "width:118px" | "width:280px" | "width:222px" | "width:200px";
    constructor();
    /**
     * Événement JET qui se déclenche à chaque connexion.
     */
    connected(): void;
    /**
     * Événement JET qui se déclenche à chaque déconnexion.
     */
    disconnected(): void;
    /**
     * Événement JET qui se déclenche après la transition à la nouvelle vue.
     */
    transitionCompleted(): void;
}
export = TestViewModel;
