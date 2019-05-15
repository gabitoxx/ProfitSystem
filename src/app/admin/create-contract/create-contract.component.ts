import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBarConfig, MatSnackBar, MatSlideToggleChange } from '@angular/material';
import { AccountService } from 'src/app/services/account.service';
import { UsersService } from 'src/app/services/users.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { IAccount } from 'src/app/interfaces/IAccount';
import { IUser } from 'src/app/interfaces/IUser';
import { IContract } from 'src/app/interfaces/IContract';
import { IInvestor } from 'src/app/interfaces/IInvestor';
import { getMultipleValuesInSingleSelectionError } from '@angular/cdk/collections';
import { ContractService } from 'src/app/services/contract.service';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';

export interface PeriodicElement {
  id: string;
  name: string;
  porc_diario: number;
  porcentaje: number;
  responsable: string;
  delete: string;
}

const MODAL_ANCHO:string = '550px';
const MODAL_ALTO:string = '400px';
const SI:string = 'Sí';

var ELEMENT_DATA: PeriodicElement[] = [
  {id: '1', porc_diario: 0.7, name: 'Pepito PErez', porcentaje: 20, responsable: 'No', delete: 'X'},
  {id: '2', porc_diario: 0.4, name: 'Gab Sanchez', porcentaje: 15, responsable: 'No', delete: 'X'},
  {id: '3', porc_diario: 0.3, name: 'Darth Vader', porcentaje: 10, responsable: SI, delete: 'X'},
  {id: '4', porc_diario: 0.1, name: 'Harry Potter', porcentaje: 5, responsable: 'No', delete: 'X'},
];

export interface IDialogData {
  animal: string;
  name: string;
  users: IUser[];
}


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

  /** Cuentas y 1 la seleccionada */
  accounts: IAccount[];
  accountSelected: IAccount = null;

  /** Formulario */
  contractName : string = '';
  day:  number = 30;
  prpm: number = 0;
  constante: number = 0;

  /* Tabla: columnas a mostrar */
  displayedColumns: string[] = ['name', /*'porcentaje', 'porc_diario',*/ 'responsable', 'delete'];
  dataSource = [];

  /** lista de usuarios para el Modal y los seleccionados */
  users: IUser[];
  inversionistas: PeriodicElement[] = [];

  // Dialog - modal data
  
  inv_person: string;

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  
  constructor(
      private router: Router,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private accountService: AccountService,
      private userService: UsersService,
      private contractService: ContractService){
        
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


  selectedAccount(cuentaId: string){
    console.log("cuenta:", cuentaId);
    var c:IAccount;
    var i:number;
    for ( i = 0; i < this.accounts.length; i++ ){
      c = this.accounts[i];
      if ( c.id == cuentaId ){
        break;
      }
    }
    this.accountSelected = c;

  }
  

  goHome(){
    this.router.navigate(["admin/home"]);
  }


  /**
   * Recorre toda la tabla y saca al que hay que eliminar
   * @param investorId 
   */
  deleteInvestor(investorId:string){
    console.log('Eliminar este: ' + investorId);

    var data:PeriodicElement[] = [];
    var i;
      for (i=0; i < this.inversionistas.length; i++){

        if ( this.inversionistas[i].id != investorId ){
          /* Si tiene ID diferente se añade a la tabla resultante */
          data.push( this.inversionistas[i] );
        }
      }

      this.dataSource     = data;
      this.inversionistas = data;
  }


  /**
   * Abre el Modal; y se suscribe al evento de cierre
   * Re-crea la tabla y arreglo de Inversionistas
   */
  addInvestor() {

    const dialogRef = this.dialog.open(AddInvestorModalDialog, {
      width: MODAL_ANCHO,
      height: MODAL_ALTO,
      data: {
        name: '',
        animal: '',
        users: this.users,
        inv: this.INV,
        activo: this.STATUS_ACTIVO,
        adm: this.ADM
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed:',result);

      var nuevo:PeriodicElement = {
        id: result.id, 
        name: result.nombres + " " + result.apellidos, 
        responsable: (result.responsable) ? SI : 'No',
        delete: 'X',
        porc_diario: 0,
        porcentaje: 1
      }

      var data:PeriodicElement[] = [];

      var i;
      for (i=0; i < this.inversionistas.length; i++){
        data.push( this.inversionistas[i] );
      }

      data.push( nuevo );
      this.dataSource = data;

      this.inversionistas.push( nuevo );
    });
  }

  
  newContract(){
    //alert('1. Crear Contrato en la BD, 2. ver si se puede enviar email con creacion de contrato para registros 3.  Snackbar avisando creacion exitosa (podrá verse todAs lAs cuentas en la pág de consulta de Cuentas) y volver a pág de inicio');

    if ( !this.validarForm() ){
      return;
    }

    // Recorrer los Inversores
    var invests:IInvestor[] = [];
    var responsableID:string = '';
    for ( var i = 0; i < this.inversionistas.length; i++ ){
      
      var current: IInvestor = {
        id: this.inversionistas[i].id,
        activo: true,
        fechaActivo: Date.now(),
        fechaInactivo: 0
      }
      invests.push( current );

      if ( this.inversionistas[i].responsable == SI ){
        responsableID = this.inversionistas[i].id;
      }
    }

    //
    var contrato:IContract = {
      id: CONSTANTES_UTIL.PREFFIX_CONTRATC + Date.now(),
      nombre: this.contractName,
      estatusActivo: true,
      fechaCreacion: ValidatorUtils.getFechaFormato1(),
      cuentaId: this.accountSelected.id,
      diaCorteMes: this.day,
      porcentaje: this.prpm,
      responsableId: responsableID,
      inversionistasIds: invests,
      capital: 0.0,
      constanteDeuda: this.constante
    }

    console.log('contrato:::',contrato);

    //servicio
    this.contractService.createContract(contrato).then(
        () => {
          console.log('Contrato creado ');

          let snackBarRef = this.snackBar.open(
            'Contrato creado. Puede verlos y editarlos en "Ver Contratos"',
            'Entendido', this.configSuccess
          );

          snackBarRef.onAction().subscribe(() => { this.goHome(); });
          
          // 3 segundos
          window.setTimeout(() => { this.goHome(); }, 3000);
          
        }, (error) => {
          console.error("Firebase: NO se puede crear CONTRATO: ", error);
          this.snackBar.open("Creación de Contrato fallido: " + CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'Ok', this.configError);
        }
    );
    
  }


  /**
   * Validaciones del Contrato
   */
  validarForm() {

    if ( this.contractName == null || this.contractName.trim() == '' ){
      this.snackBar.open('Indique un nombre para el Contrato.', 'Entendido', this.configError);
      return false;

    } else if ( this.accountSelected == null || this.accountSelected.id.trim() == '' ){
      this.snackBar.open('Debe seleccionar una Cuenta.', 'Entendido', this.configError);
      return false;

    } else if ( this.day == null || this.day <= 0 || this.day > 31 ){
      this.snackBar.open('Día del Mes inválido (debe ser entre 1 y 31).', 'Entendido', this.configError);
      return false;

    } else if ( this.prpm == null || this.prpm <= 0 || this.prpm > 100 ){
      this.snackBar.open('Porcentaje inválido (debe ser entre 1% y 100%).', 'Entendido', this.configError);
      return false;

    } else if ( this.inversionistas == null || this.inversionistas.length <= 0 ){
      this.snackBar.open('Debe existir al menos un Inversionista.', 'Ok', this.configError);
      return false;

    } else if ( this.constante == null || this.constante <= 0 ){
      this.snackBar.open('Debe especificar una cantidad ($) constante para los Clientes.', 'Ok', this.configError);
      return false;
    }
    
    var countResp:number = 0;
    for (var i = 0; i < this.inversionistas.length; i++){
      if ( this.inversionistas[i].responsable == SI ){
        countResp++;
      }
      if ( countResp > 1 ){
        break;
      }
    }
    if ( countResp > 1 ){
      this.snackBar.open('Solo debe haber 1 Responsable del Contrato. Elimine los registros y rehaga la selección de Inversionistas.', 'Ok', this.configError);
      return false;
    }
    
    return true;
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

  users: IUser[];
  userSelected: IUser = null;

  constructor(
    public dialogRef: MatDialogRef<AddInvestorModalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) {

      console.log("data.users", data.users);
      this.users2 = data.users;

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedInvestor(idInvestor:string){
    console.log("click investor:", idInvestor);
    
    var i:number; 
    var u:IUser;
    for ( i = 0; i < this.users2.length; i++ ){
      u = this.users2[i];
      if ( u.id == idInvestor ){
        break;
      }
    }
    this.userSelected = u;
    this.name2 = u.email;
    this.animal2 = u.telefono;
  }

  toogleResponsabilidad = (ob: MatSlideToggleChange) => {
    console.log("ob",ob.checked)
    if ( null == this.userSelected || undefined == this.userSelected ){
      return;
    } else {
      this.userSelected.responsable = ob.checked;
    }
  }

}