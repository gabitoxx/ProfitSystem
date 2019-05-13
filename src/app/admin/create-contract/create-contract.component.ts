import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { AccountService } from 'src/app/services/account.service';
import { UsersService } from 'src/app/services/users.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { IAccount } from 'src/app/interfaces/IAccount';
import { IUser } from 'src/app/interfaces/IUser';
import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';

export interface PeriodicElement {
  id: number;
  name: string;
  porc_diario: number;
  porcentaje: number;
  responsable: string;
  delete: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, porc_diario: 0.7, name: 'Pepito PErez', porcentaje: 20, responsable: 'No', delete: 'X'},
  {id: 2, porc_diario: 0.4, name: 'Gab Sanchez', porcentaje: 15, responsable: 'No', delete: 'X'},
  {id: 3, porc_diario: 0.3, name: 'Darth Vader', porcentaje: 10, responsable: 'Sí', delete: 'X'},
  {id: 4, porc_diario: 0.1, name: 'Harry Potter', porcentaje: 5, responsable: 'No', delete: 'X'},
];

export interface IDialogData {
  animal: string;
  name: string;
  users: IUser[];
}

const MODAL_ANCHO:string = '550px';
const MODAL_ALTO:string = '400px';

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.css']
})
export class CreateContractComponent implements OnInit {
  
  STATUS_ACTIVO:string   = CONSTANTES_UTIL.USUARIO_ACTIVO;
  STATUS_INACTIVO:string = CONSTANTES_UTIL.USUARIO_INACTIVO;

  INV:string = CONSTANTES_UTIL.ROL_INVERSIONISTA;
  ADM:string = CONSTANTES_UTIL.ROL_ADMIN;
  EST:string = CONSTANTES_UTIL.ROL_ACADEMIA;

  account: string = "";
  currency: string = "";
  available: number = 0.0;
  /* XXX */
  dummyIndex:number = 0;
  dummyData1:string[] = ['USD ($)', 'EUR (€)', 'COP ($)'];
  dummyData2:number[] = [1000.0, 2000.0, 3000.0];

  accounts: IAccount[];

  expense: number = 30;

  /* XXX */
  displayedColumns: string[] = ['name', /*'porcentaje', 'porc_diario',*/ 'responsable', 'delete'];
  dataSource = ELEMENT_DATA;

  users: IUser[];

  // Dialog - modal data
  animal: string;
  name: string;
  inv_person: string;
  inv_prpm: number;
  email: string;

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  
  constructor(
      private router: Router,
      public dialog: MatDialog,
      private accountService: AccountService,
      private userService: UsersService,
      private snackBar: MatSnackBar){
        
    this.configError = {
      panelClass: ['snackbar-accion-failure'],
      duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
    };
    
    this.configSuccess = {
      panelClass: ['snackbar-accion-succes'],
      duration: CONSTANTES_UTIL.SNACKBAR_DURATION_SUCCESS,
    };
  }

  ngOnInit() {
    
    this.getUsers();
    this.getAccounts();
  }


  getUsers() {
    this.userService.getUsers().valueChanges().subscribe(
      ( data: IUser[] ) => {
        this.users = data;
        
      }, (error) => {
        console.error('CreateContractComponent.getUsers() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }


  getAccounts() {
    this.accountService.getAccounts().valueChanges().subscribe(
      ( data: IAccount[] ) => {
        this.accounts = data;
        
      }, (error) => {
        console.error('CreateContractComponent.getAccounts() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }


  selectedAccount(cuenta: any){
    console.log("cuenta:", cuenta);
    this.currency   = this.dummyData1[ this.dummyIndex ];
    this.available = this.dummyData2[ this.dummyIndex ];
    this.dummyIndex++;
    if ( this.dummyIndex >= 3 ){
      this.dummyIndex = 0;
    }
  }

  newContract(){
    alert('1. Crear Contrato en la BD, 2. ver si se puede enviar email con creacion de contrato para registros 3.  Snackbar avisando creacion exitosa (podrá verse todAs lAs cuentas en la pág de consulta de Cuentas) y volver a pág de inicio');
    this.goHome();
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }

  deleteInvestor(id:number){
    alert('Eliminar este: ' + id);
  }

  addInvestor() {
    this.name = 'avengers@domin.io';
    this.animal = '321 132 4567';

    const dialogRef = this.dialog.open(AddInvestorModalDialog, {
      width: MODAL_ANCHO,
      height: MODAL_ALTO,
      data: {
        name: this.name,
        animal: this.animal,
        users: this.users,
        inv: this.INV,
        activo: this.STATUS_ACTIVO,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }


}

@Component({
  selector: 'dialog-modal-add-investor',
  templateUrl: 'dialog-modal-add-investor.html',
})
export class AddInvestorModalDialog {

  name2: string   = "";
  animal2: string = "";
  users2: IUser[];

  /* XXX */
  dummyIndex2:number = 0;
  dummyData3:string[] = ['avengers@domin.io', 'ragnarok@domin.io', 'endgame@domin.com'];
  dummyData4:string[] = ['3001234567', '301 - 132.4657', '320 - 9876543'];

  users: IUser[];

/*
  inv_person
  inv_prpm
  investor
*/

  constructor(
    public dialogRef: MatDialogRef<AddInvestorModalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) {

      console.log("data.users", data.users);
      this.users2 = data.users;

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedInvestor(investor){
    console.log("click investor:", investor);
    
    var i:number; 
    var u:IUser; debugger;//XXX
    for ( i = 0; i < this.users2.length; i++ ){
      u = this.users2[i];

    }
  }

}