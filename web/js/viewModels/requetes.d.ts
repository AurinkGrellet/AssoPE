/**
 * @author Aurink GRELLET
 * ViewModel de l'application simple de requêtes CRUD + Recherche
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
/** Interfaces **/
/**
 * Attributs de base d'un adhérent
 */
interface BaseAdherent {
    nom: string;
    prenom: string;
    email: string;
    adresse: string;
}
/**
 * Attributs complets d'un adhérent
 */
interface Adherent extends BaseAdherent {
    _id: number;
}
/**
 * Critère de recherche
 */
interface Critere {
    critere: string;
    valeur: string | number;
}
/**
 * ViewModel Requetes
 */
declare class RequetesViewModel {
    private readonly serviceURL;
    grid: ko.Observable;
    collection: CollectionDataProvider<string, string>;
    nextId: number;
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
     * Définit les attributs à utiliser pour afficher les données reçues de l'API
     * @param response objet à formater
     * @returns objet formaté
     */
    private parseAdh;
    /**
     * Définit les attributs à utiliser pour les requêtes
     * @param response objet à formater
     * @returns objet formaté
     */
    private parseSaveAdh;
    /**
     * Modèle des adhérents
     */
    private Adherent;
    private myAdh;
    /**
     * Collection connectée à l'API
     */
    private AdhCollection;
    /**
     * Crée un objet Adherent avec les valeurs saisies dans la vue
     * @returns objet Adherent correspondant
     */
    buildModel: (type: string) => Adherent;
    /**
     * Affiche dans les saisies de texte les attributs de l'adhérent passé en paramètre
     * @param model adhérent à afficher
     */
    updateFields: any;
    /**
     * Recherche dans le vecteur de modèles l'id passé en paramètre
     * @param models collection des Adhérents
     * @param id id à tester
     * @returns true si l'id fourni n'est pas déjà utilisé par un Model, false sinon
     */
    checkIds: (models: Model[], id: number) => boolean;
    /**
     * Vérifie si toutes les propriétés du modèle passé en paramètre sont conformes
     * @param model modèle à tester
     * @returns true si le modèle est complet, false sinon
     */
    checkModel(model: Adherent, type: string): boolean;
    /** Événements **/
    /**
     * Crée et ajoute un nouvel adhérent à partir des valeurs saisies dans la vue
     */
    ajout: any;
    /**
     * Envoie une requête PUT pour mettre à jour l'adhérent sélectionné,
     * en utilisant les valeurs saisies dans la vue
     */
    update: any;
    /**
     * Ouvre une fenêtre de dialogue demandant confirmation pour la suppression de l'adhérent
     */
    remove: () => void;
    /**
     * Rafraîchit les données et réinitialise les objets graphiques
     */
    reset: any;
    /**
     * Met à jour la collection pour n'afficher que les modèles correspondant aux critères
     */
    critereChange: any;
    /**
     * @returns vecteur des filtres utilisés
     */
    filtresActifs(): Critere[];
    /**
     * Réinitialise AdhCol à sa valeur par défaut si un filtre est actif
     */
    resetDataSource(): void;
    /**
     * Met à jour collection et dataSource en envoyant une requête à l'API
     * @param type
     */
    fetchDataSource(): void;
    /**
     * Ferme la fenêtre de dialogue de suppression d'adhérent
     */
    cancelDialog(): boolean;
    /**
     * Supprime l'adhérent sélectionné, puis referme la fenêtre de dialogue
     */
    deleteAdh: any;
    /**
     * Renvoie la largeur des colonnes à afficher
     * @param headerContext Contexte de l'entête
     */
    getHeaderClassName(headerContext: ojDataGrid.HeaderContext<string, string>): "width:74px" | "width:118px" | "width:280px" | "width:222px" | "width:200px";
    constructor();
    /**
     * Événement JET qui se déclenche à chaque connexion
     */
    connected(): void;
    /**
     * Événement JET qui se déclenche à chaque déconnexion
     */
    disconnected(): void;
    /**
     * Événement JET qui se déclenche après la transition à la nouvelle vue
     */
    transitionCompleted(): void;
}
export = RequetesViewModel;
