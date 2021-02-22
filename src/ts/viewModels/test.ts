/**
 * LE PROBLEME : 
 * Pour chaque module, j'ai ajouté leur chemin au fichier path_mapping.json
 * Quand j'importe les modules mongodb et mysql, dès qu'ils sont chargés (donc dès que je clique sur l'onglet "test") la grille ne se charge pas et des erreurs apparaissent dans la console
 * Avec mongodb, l'erreur est : "lib/core" has not been loaded yet for context: _
 * Avec mysql (et typeorm), l'erreur est : "exports is not defined"
 * J'imagine que je dois mal importer ces modules, ou que la version visée de ECMAScript (de Typescript) n'est pas compatible avec "exports" et/ou "module.export"...
 */


/**
 * Manque :
 * -> Réussir à faire fonctionner l'importation
 * -> Réussir à lier (knockout) test.ts à la DataGrid
 * 
  * 1 Connexion fonctionnelle à MongoDB (Web Component / ou, d'ailleurs, pas forcément -> utiliser path-mappings.json fonctionne si on met bien debug ET release)
 * * Le bouton actuel SELECT déclenchera une fonction qui sera elle même également déclenchée automatiquement au "connected" de la page
 * * Cliquer sur une ligne remplie du tableau affiche 2 autres(!) boutons (un peu en mode drawer si possible)
 * (!)2 Boutons : UPDATE et DELETE
 *
 * A savoir que "transitionCompleted()" s'active une fois la nouvelle table chargée, ce qui pourrait avoir ses utilités
 */

import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import * as ConverterUtils from "ojs/ojconverterutils-i18n";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import "ojs/ojdatagrid";
import "ojs/ojformlayout";
import "ojs/ojdialog";
import "ojs/ojcollectiondataprovider"
import "ojs/ojcollectiondatagriddatasource";
import { ojButton } from "ojs/ojbutton";
import { ojDataGrid } from "ojs/ojdatagrid";
import { ojButtonEventMap } from "ojs/ojbutton";
import { Model, Collection } from "ojs/ojmodel";
import CollectionDataProvider = require("ojs/ojcollectiondataprovider");
import { ojDialog } from "ojs/ojdialog";


/**
 * Interface de la base de données
 */
interface Adherents {
    id: number;
    prenom: string;
    nom: string;
    adresse: string;
    mail: string;
}

interface Dep {
    id: number,
    prenom: string,
    nom: string,
    mail: string,
    tel: string,
    date: Date,
    salaire: number,
    depId: number
}

/**
 * ViewModel Test
 */
class TestViewModel {
    // events
    clickedButton: ko.Observable<string>; // boutons

    // initialisations
    urldb: string = 'mongodb+srv://admin:kr0Z7h5upRAt9l57@assope.tab38.mongodb.net/assope?retryWrites=true&w=majority';
    urljson: string = "js/views/adherentData.json";
    grid: ojDataGrid<number, string> = document.getElementById("datagrid") as ojDataGrid<number, string>;
    dataSource: ko.Observable = ko.observable();
    nextKey: number = 121;

    //reset the fields to their original values
    resetFields = function () {
        this.inputEmployeeID(this.nextKey);
        this.inputFirstName('Jane');
        this.inputLastName('Doe');
        this.inputHireDate(ConverterUtils.IntlConverterUtils.dateToLocalIso(new Date()));
        this.inputSalary(15000);
    }.bind(this);

    //intialize the observable values in the forms
    inputEmployeeID = ko.observable(this.nextKey);
    inputFirstName = ko.observable('Jane');
    inputLastName = ko.observable('Doe');
    inputHireDate = ko.observable(ConverterUtils.IntlConverterUtils.dateToLocalIso(new Date()));
    inputSalary = ko.observable(15000);

    // [!]méthodes TODO
    reset = () => { };

    // getters
    getCellClassName = function (cellContext: ojDataGrid.CellContext<string, string>) {
        var key = cellContext['keys']['column'];
        if (key === 'SALARY') {
            return 'oj-helper-justify-content-right';
        }
        return 'oj-helper-justify-content-flex-start';
    }

    /* Mongoose */
    /*
    mongodb: MongoClient;
    getDB = function () {
        var connOpt: MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
        this.mongodb = async () => await new MongoClient('mongodb+srv://admin:kr0Z7h5upRAt9l57@assope.tab38.mongodb.net/assope?retryWrites=true&w=majority', connOpt);
    }
    */
    currentDeptName: ko.Observable = ko.observable("default");
    newDeptId: ko.Observable = ko.observable(555);
    newDeptName: ko.Observable = ko.observable("");
    private workingId: ko.Observable = ko.observable("");
    private findDeptIds = () => {
        let selectedIdsArray = [];
        // ici retrouver la ligne sélectionnée

        return selectedIdsArray;
    };
    remove = (event: ojButton.ojAction, data: TestViewModel) => {
        let deptIds = [];
        deptIds = this.findDeptIds();
        const collection = data.DeptCol();
        deptIds.forEach((value: number) => {
            const model = collection.get(value);

            if (model) {
                collection.remove(model);
                model.destroy();
            }
        });
        (document.getElementById("datagrid") as ojDataGrid<number, string>).refresh();
    };
    showChangeNameDialog = (
        deptId: number,
        event: CustomEvent,
        data: {
            DepartmentId: number;
            DepartmentName: string;
            LocationId: number;
            ManagerId: number;
        }
    ) => {
        const currName = data.DepartmentName;
        this.workingId(deptId);
        this.currentDeptName(currName);
        (document.getElementById("editDialog") as ojDialog).open();
    };
    cancelDialog = () => {
        (document.getElementById("editDialog") as ojDialog).close();
        return true;
    };
    update = (event: ojButton.ojAction) => {
        const currentId = this.workingId();
        const myCollection = this.DeptCol();
        const myModel = myCollection.get(currentId);
        const newName = this.currentDeptName();

        if (newName != myModel.get("DepartmentName") && newName != "") {
            myModel.save(
                {
                    DepartmentName: newName,
                },
                {
                    success: (myModel, response, options) => {
                        (document.getElementById("editDialog") as ojDialog).close();
                    },
                    error: (jqXHR, textStatus: string, errorThrown) => {
                        alert("Update failed with: " + textStatus);
                        (document.getElementById("editDialog") as ojDialog).close();
                    },
                }
            );
        } else {
            alert("Department Name is not different or the new name is not valid");
            (document.getElementById("editDialog") as ojDialog).close();
        }
    };
    ajout = () => {
        const recordAttrs = {
            DepartmentId: this.newDeptId(),
            DepartmentName: this.newDeptName(),
        };
        this.DeptCol().create(recordAttrs, {
            wait: true,
            contentType: "application/vnd.oracle.adf.resource+json",
            success: (model, response) => { },
            error: (jqXHR, textStatus, errorThrown) => { },
        });
        // !!! add recordAttrs to database
    };
    
    private DeptCol: ko.Observable = ko.observable();
    datasource: ko.Observable = ko.observable();
    private parseSaveDept = (response: {
        DepartmentId: number;
        DepartmentName: string;
        LocationId: number;
        ManagerId: number;
    }) => {
        return {
            DepartmentId: response["DepartmentId"],
            DepartmentName: response["DepartmentName"],
            LocationId: response["LocationId"],
            ManagerId: response["ManagerId"],
        };
    };
    private parseDept = (response: {
        DepartmentId: number;
        DepartmentName: string;
        LocationId: number;
        ManagerId: number;
    }) => {
        return {
            DepartmentId: response["DepartmentId"],
            DepartmentName: response["DepartmentName"],
            LocationId: response["LocationId"],
            ManagerId: response["ManagerId"],
        };
    };
    Department = Model.extend({
        urlRoot: this.urljson,
        parse: this.parseDept,
        parseSave: this.parseSaveDept,
        idAttribute: "DepartmentId",
    });
    private myDept = new this.Department();
    private DeptCollection = Collection.extend({
        url: this.urljson,
        model: this.myDept,
        comparator: "DepartmentId",
    });

    constructor() {
        //this.getDB();
        this.DeptCol(new this.DeptCollection());
        this.dataSource(new CollectionDataProvider(this.DeptCol()));
    }

    public selectClick = async (event: ojButtonEventMap["ojAction"]) => {

    };

    /* Events from JET */
    connected(): void {
        AccUtils.announce("Test page loaded.");
        document.title = "Test";
        document.getElementById('datagrid').addEventListener('selectionChanged', function (event) {
            //on selection change update fields with the selected model
            var selection = event.detail['value'][0];
            if (selection != null) {
                var rowKey = selection['startKey']['row'];
                this.modelToUpdate = this.collection.get(rowKey);
                this.updateFields(this.modelToUpdate);
            }
        }.bind(this));
        this.grid = document.getElementById("datagrid") as ojDataGrid<number, string>
    }

    disconnected(): void {
    }

    transitionCompleted(): void {
    }
}

export = TestViewModel;