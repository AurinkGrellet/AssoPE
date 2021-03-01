/**
 * LE PROBLEME :
 * Pour chaque module, j'ai ajouté leur chemin au fichier path_mapping.json
 * Quand j'importe les modules mongodb et mysql, dès qu'ils sont chargés (donc dès que je clique sur l'onglet "test") la grille ne se charge pas et des erreurs apparaissent dans la console
 * Avec mongodb, l'erreur est : "lib/core" has not been loaded yet for context: _
 * Avec mysql (et typeorm), l'erreur est : "exports is not defined"
 * J'imagine que je dois mal importer ces modules, ou que la version visée de ECMAScript (de Typescript) n'est pas compatible avec "exports" et/ou "module.export"...
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../accUtils", "knockout", "ojs/ojconverterutils-i18n", "ojs/ojmodel", "ojs/ojcollectiondataprovider", "ojs/ojknockout", "ojs/ojinputtext", "ojs/ojbutton", "ojs/ojdatagrid", "ojs/ojformlayout", "ojs/ojdialog", "ojs/ojcollectiondataprovider", "ojs/ojcollectiondatagriddatasource"], function (require, exports, AccUtils, ko, ConverterUtils, ojmodel_1, CollectionDataProvider) {
    "use strict";
    /**
     * ViewModel Test
     */
    class TestViewModel {
        constructor() {
            // initialisations
            this.urldb = 'mongodb+srv://admin:kr0Z7h5upRAt9l57@assope.tab38.mongodb.net/assope?retryWrites=true&w=majority';
            this.urljson = "js/views/adherentData.json";
            this.grid = document.getElementById("datagrid");
            this.dataSource = ko.observable();
            this.nextKey = 121;
            //reset the fields to their original values
            this.resetFields = function () {
                this.inputEmployeeID(this.nextKey);
                this.inputFirstName('Jane');
                this.inputLastName('Doe');
                this.inputHireDate(ConverterUtils.IntlConverterUtils.dateToLocalIso(new Date()));
                this.inputSalary(15000);
            }.bind(this);
            //intialize the observable values in the forms
            this.inputEmployeeID = ko.observable(this.nextKey);
            this.inputFirstName = ko.observable('Jane');
            this.inputLastName = ko.observable('Doe');
            this.inputHireDate = ko.observable(ConverterUtils.IntlConverterUtils.dateToLocalIso(new Date()));
            this.inputSalary = ko.observable(15000);
            // [!]méthodes TODO
            this.reset = () => { };
            // getters
            this.getCellClassName = function (cellContext) {
                var key = cellContext['keys']['column'];
                if (key === 'SALARY') {
                    return 'oj-helper-justify-content-right';
                }
                return 'oj-helper-justify-content-flex-start';
            };
            /* Mongoose */
            /*
            mongodb: MongoClient;
            getDB = function () {
                var connOpt: MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
                this.mongodb = async () => await new MongoClient('mongodb+srv://admin:kr0Z7h5upRAt9l57@assope.tab38.mongodb.net/assope?retryWrites=true&w=majority', connOpt);
            }
            */
            this.currentDeptName = ko.observable("default");
            this.newDeptId = ko.observable(555);
            this.newDeptName = ko.observable("");
            this.workingId = ko.observable("");
            this.findDeptIds = () => {
                let selectedIdsArray = [];
                // ici retrouver la ligne sélectionnée
                return selectedIdsArray;
            };
            this.remove = (event, data) => {
                let deptIds = [];
                deptIds = this.findDeptIds();
                const collection = data.DeptCol();
                deptIds.forEach((value) => {
                    const model = collection.get(value);
                    if (model) {
                        collection.remove(model);
                        model.destroy();
                    }
                });
                document.getElementById("datagrid").refresh();
            };
            this.showChangeNameDialog = (deptId, event, data) => {
                const currName = data.DepartmentName;
                this.workingId(deptId);
                this.currentDeptName(currName);
                document.getElementById("editDialog").open();
            };
            this.cancelDialog = () => {
                document.getElementById("editDialog").close();
                return true;
            };
            this.update = (event) => {
                const currentId = this.workingId();
                const myCollection = this.DeptCol();
                const myModel = myCollection.get(currentId);
                const newName = this.currentDeptName();
                if (newName != myModel.get("DepartmentName") && newName != "") {
                    myModel.save({
                        DepartmentName: newName,
                    }, {
                        success: (myModel, response, options) => {
                            document.getElementById("editDialog").close();
                        },
                        error: (jqXHR, textStatus, errorThrown) => {
                            alert("Update failed with: " + textStatus);
                            document.getElementById("editDialog").close();
                        },
                    });
                }
                else {
                    alert("Department Name is not different or the new name is not valid");
                    document.getElementById("editDialog").close();
                }
            };
            this.ajout = () => {
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
            this.DeptCol = ko.observable();
            this.datasource = ko.observable();
            this.parseSaveDept = (response) => {
                return {
                    DepartmentId: response["DepartmentId"],
                    DepartmentName: response["DepartmentName"],
                    LocationId: response["LocationId"],
                    ManagerId: response["ManagerId"],
                };
            };
            this.parseDept = (response) => {
                return {
                    DepartmentId: response["DepartmentId"],
                    DepartmentName: response["DepartmentName"],
                    LocationId: response["LocationId"],
                    ManagerId: response["ManagerId"],
                };
            };
            this.Department = ojmodel_1.Model.extend({
                urlRoot: this.urljson,
                parse: this.parseDept,
                parseSave: this.parseSaveDept,
                idAttribute: "DepartmentId",
            });
            this.myDept = new this.Department();
            this.DeptCollection = ojmodel_1.Collection.extend({
                url: this.urljson,
                model: this.myDept,
                comparator: "DepartmentId",
            });
            this.selectClick = (event) => __awaiter(this, void 0, void 0, function* () {
            });
            //this.getDB();
            this.DeptCol(new this.DeptCollection());
            this.dataSource(new CollectionDataProvider(this.DeptCol()));
        }
        /* Events from JET */
        connected() {
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
            this.grid = document.getElementById("datagrid");
            /**
             * Call to API
             */
            /*
            
                    // GET test (changer "" par un nombre pour récupérer un adhérent précis)
                    var resGet = callApi("/api/menu/adherents/", "GET", "");
                    resGet.then((value) => {
                        console.log(value.adherents[2].adresse);
                        console.log(value.statusCode);
                        // "value" contient le résultat de la requête
                    });
            
                    // POST test
                    var resPost = callApi("/api/menu/adherents/", "POST", {nom: "Dupont", prenom: "Richard", adresse: "238 Rue Kleber - 93000 Toulon", email: "richard.dupont@hotmail.com"});
                    resPost.then((value) => {
                        console.log(value.statusCode);
                        // contient le nouvel adhérent + status
                    });
            
                    // PUT test
                    var resPut = callApi("/api/menu/adherents/", "PUT", {_id:"5", nom: "Dupont", prenom:"Richard", adresse:"237 Rue Kleber - 93000 Toulon", email:"richard.dupont@hotmail.com"});
                    resPut.then((value) => {
                        console.log(value.statusCode);
                        // contient l'adhérent mis à jour + status
                    });
            
                    // DELETE test
                    var resDel = callApi("/api/menu/adherents/", "DELETE", "6");
                    resDel.then((value) => {
                        console.log(value.statusCode);
                        // contient le status
                    });
            
            */
        }
        disconnected() {
        }
        transitionCompleted() {
        }
    }
    return TestViewModel;
});
//# sourceMappingURL=test.js.map