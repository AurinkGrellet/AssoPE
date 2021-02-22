/**
 * LE PROBLEME :
 * Pour chaque module, j'ai ajouté leur chemin au fichier path_mapping.json
 * Quand j'importe les modules mongodb et mysql, dès qu'ils sont chargés (donc dès que je clique sur l'onglet "test") la grille ne se charge pas et des erreurs apparaissent dans la console
 * Avec mongodb, l'erreur est : "lib/core" has not been loaded yet for context: _
 * Avec mysql (et typeorm), l'erreur est : "exports is not defined"
 * J'imagine que je dois mal importer ces modules, ou que la version visée de ECMAScript (de Typescript) n'est pas compatible avec "exports" et/ou "module.export"...
 */
import * as ko from "knockout";
import "ojs/ojknockout";
import "ojs/ojinputtext";
import "ojs/ojbutton";
import "ojs/ojdatagrid";
import "ojs/ojformlayout";
import "ojs/ojdialog";
import "ojs/ojcollectiondataprovider";
import "ojs/ojcollectiondatagriddatasource";
import { ojButton } from "ojs/ojbutton";
import { ojDataGrid } from "ojs/ojdatagrid";
import { ojButtonEventMap } from "ojs/ojbutton";
/**
 * ViewModel Test
 */
declare class TestViewModel {
    clickedButton: ko.Observable<string>;
    urldb: string;
    urljson: string;
    grid: ojDataGrid<number, string>;
    dataSource: ko.Observable;
    nextKey: number;
    resetFields: any;
    inputEmployeeID: ko.Observable<number>;
    inputFirstName: ko.Observable<string>;
    inputLastName: ko.Observable<string>;
    inputHireDate: ko.Observable<string>;
    inputSalary: ko.Observable<number>;
    reset: () => void;
    getCellClassName: (cellContext: ojDataGrid.CellContext<string, string>) => "oj-helper-justify-content-right" | "oj-helper-justify-content-flex-start";
    currentDeptName: ko.Observable;
    newDeptId: ko.Observable;
    newDeptName: ko.Observable;
    private workingId;
    private findDeptIds;
    remove: (event: ojButton.ojAction, data: TestViewModel) => void;
    showChangeNameDialog: (deptId: number, event: CustomEvent, data: {
        DepartmentId: number;
        DepartmentName: string;
        LocationId: number;
        ManagerId: number;
    }) => void;
    cancelDialog: () => boolean;
    update: (event: ojButton.ojAction) => void;
    ajout: () => void;
    private DeptCol;
    datasource: ko.Observable;
    private parseSaveDept;
    private parseDept;
    Department: any;
    private myDept;
    private DeptCollection;
    constructor();
    selectClick: (event: ojButtonEventMap["ojAction"]) => Promise<void>;
    connected(): void;
    disconnected(): void;
    transitionCompleted(): void;
}
export = TestViewModel;
