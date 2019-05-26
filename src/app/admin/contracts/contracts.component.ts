import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarConfig, MatSlideToggleChange, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UsersService } from 'src/app/services/users.service';
import { AccountService } from 'src/app/services/account.service';
import { ContractService } from 'src/app/services/contract.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { IContract } from 'src/app/interfaces/IContract';
import { IUser } from 'src/app/interfaces/IUser';
import { IAccount } from 'src/app/interfaces/IAccount';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';
import { ISeleccionUsuario } from 'src/app/interfaces/ISeleccionUsuario';

const MODAL_ANCHO:string = '550px';
const MODAL_ALTO:string = '90%';

export interface IDialogData {
  correo: string;
  telef: string;
  users: IUser[];
  contrato: IContract;
}

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {

  STATUS_ACTIVO:string   = CONSTANTES_UTIL.USUARIO_ACTIVO;
  STATUS_INACTIVO:string = CONSTANTES_UTIL.USUARIO_INACTIVO;

  INV:string = CONSTANTES_UTIL.ROL_INVERSIONISTA;
  ADM:string = CONSTANTES_UTIL.ROL_ADMIN;
  EST:string = CONSTANTES_UTIL.ROL_ACADEMIA;

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  
  /** Listas */
  arrayContracts: IContract[];
  arrayUser: IUser[];
  arrayCuentas: IAccount[];

  constructor(
      private router: Router,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private accountService: AccountService,
      private userService: UsersService,
      private contractService: ContractService){

    this.arrayContracts = [];
    this.arrayUser = [];
    this.arrayCuentas = [];

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
    /*
     * Cargando listas
     */
    this.loadUsers();
    this.loadCuentas();
    this.loadContracts();

  }


  loadContracts() {
    this.contractService.getContracts().valueChanges().subscribe(
      ( data: IContract[] ) => {
        this.arrayContracts = data;
        console.log("arrayIDS",this.arrayContracts[0].inversionistas);

      }, (error) => {
        console.error('ContractsComponent.loadContracts() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }


  loadUsers() {
    this.userService.getUsers().valueChanges().subscribe(
      ( data: IUser[] ) => {
        this.arrayUser = data;
      }, (error) => {
        console.error('ContractsComponent.loadUsers() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }

  loadCuentas() {
    this.accountService.getAccounts().valueChanges().subscribe(
      ( data: IAccount[] ) => {
        this.arrayCuentas = data;
      }, (error) => {
        console.error('ContractsComponent.loadCuentas() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }


  getUserName(gestorId:string){
    if ( this.arrayUser.length ){
      for ( var i = 0; i < this.arrayUser.length; i++ ){
        if ( this.arrayUser[i].id == gestorId ){
          return this.arrayUser[i].nombres + " " +  this.arrayUser[i].apellidos;
        }
      }
    }
    return gestorId;
  }


  /**
   * 
   * @param cuentaId 
   * @param obj FALSE da el nombre TRUE devuelve el objeto
   */
  getCuentaName(cuentaId:string){
    if ( this.arrayCuentas.length ){
      for ( var i = 0; i < this.arrayCuentas.length; i++ ){
        if ( this.arrayCuentas[i].id == cuentaId ){
          return this.arrayCuentas[i].nombre;
        }
      }
    }
    return cuentaId;
  }
  getCuenta = (cuentaId:string) : IAccount => {
    if ( this.arrayCuentas.length ){
      for ( var i = 0; i < this.arrayCuentas.length; i++ ){
        if ( this.arrayCuentas[i].id == cuentaId ){
          return this.arrayCuentas[i];
        }
      }
    }
    return null;
  }
  
  getContrato = (id:string) : IContract => {
    if ( this.arrayContracts.length ){
      for ( var i = 0; i < this.arrayContracts.length; i++ ){
        if ( this.arrayContracts[i].id == id ){
          return this.arrayContracts[i];
        }
      }
    }
    return null;
  }
  

  toogleActivation = (contratoId:string, ob: MatSlideToggleChange) => {

    var contract = this.getContrato( contratoId );
    
    contract.estatusActivo = ob.checked;

    this.contractService.editContract( contract ).then(
      (success) => {
        var msg = (ob.checked) ? CONSTANTES_UTIL.SUCCESS_CONTRACT_ACTIVATED : CONSTANTES_UTIL.SUCCESS_CONTRACT_DEACTIVATED;
        
        this.snackBar.open("Contrato: " + msg, 'Ok', this.configSuccess);
        this.loadContracts();
      
      }).catch(
        (error) => {
          this.snackBar.open(CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'Lo intentaré de nuevo', this.configError);
          console.error("ContractsComponent - toogleActivation()", error);
        }
  );
  }


  addInvestor = (contract:IContract) => {

    const dialogRef = this.dialog.open(AddInvestorModalDialog2, {
      width: MODAL_ANCHO,
      height: MODAL_ALTO,
      data: {
        users: this.arrayUser,
        inv: this.INV,
        adm: this.ADM,
        activo: this.STATUS_ACTIVO,
        contrato: contract
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      console.log('The dialog was closed:', result);

      if ( result ){
        var r = confirm("¿Está seguro de querer agregar al Inversionista " + result.name + " al Contrato ID: " 
            + result.contratoId + "?");
        if ( r ){
          alert("NO sé cómo se hace a partir de acá: se agrega y cómo se le asigna los intereses, a partir de qué fecha, y como afecta al Contrato la inclusion de un INVERSIONISTA  NUEVO ??? ");
        }

      } else {
        this.snackBar.open('Selección de Inversionista inválida.', 'Intentaré de nuevo', this.configError);
      }
    });

  }

  removeInvestor = (contractId: string, inversorId: string) => {
    alert("Sacar del Contrato (ID: " + contractId + ") al Inversionista (id: " + inversorId + ")"
        + "AÚN no sé cómo se sacará, qué calculos hacer para LIQUIDARLO, cómo afecta al contrato y QUÉ PASA si el que intentan sacar es el RESPONSABLE de dicho contrato")
  }


  goHome(){
    this.router.navigate(["admin/home"]);
  }

}


/**********************************************************************************************************/
@Component({
  selector: 'dialog-modal-add-investor2',
  templateUrl: 'dialog-modal-add-investor2.html',
})
export class AddInvestorModalDialog2 {

  contratoActual:IContract = null;

  correo: string   = "";
  telef: string = "";
  monto: number = 0.0;
  currency: string = 'USD';

  users2: IUser[];
  users: IUser[];
  userSelected: IUser = null;

  availableUSD: number = 0.0;
  availableEUR: number = 0.0;
  availableCOP: number = 0.0;
  
  /* Validaciones */
  bErrorMontoMayor = false;
  msgErrorMontoMayor = '';

  // solo para que compile
  inv_person:string='';


  constructor(
    public dialogRef: MatDialogRef<AddInvestorModalDialog2>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) {

      console.log("data.users", data.users);
      this.users2 = data.users;

      this.userSelected = this.users2[0];

      this.contratoActual = data.contrato;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedInvestor(idInvestor:string){

    console.log("click investor:", idInvestor);
    
    var i:number; 
    var u:IUser;
    for ( i = 0; i < this.users2.length; i++ ){
      if (  this.users2[i].id == idInvestor ){
        u = this.users2[i];
        break;
      }
    }
    
    if ( !this.validForm(u) ){
      return;
    }

    this.userSelected = u;
    this.correo = u.email;
    this.telef = u.telefono;
    this.availableUSD = ( u.saldoDisponibleUSD > 0 ) ? u.saldoDisponibleUSD : 0;
    this.availableEUR = ( u.saldoDisponibleEUR > 0 ) ? u.saldoDisponibleEUR : 0;
    this.availableCOP = ( u.saldoDisponibleCOP > 0 ) ? u.saldoDisponibleCOP : 0;
  }


  /**
   * 
   * @param selected IUser
   */
  validForm(selected:IUser) {

    if ( this.monto < 0 ){
      const msg = "El monto que especifica debe ser positivo.";
      
      this.bErrorMontoMayor = true;
      this.msgErrorMontoMayor = msg;
      
      return false;

    } else if ( this.currency == CONSTANTES_UTIL.CURRENCY_DOLAR && this.availableUSD < this.monto ){
      const msg = "El monto en USD es mayor al que " 
          + selected.nombres + " " + selected.apellidos + " tiene disponible.";

      console.log(msg);
      
      this.bErrorMontoMayor = true;
      this.msgErrorMontoMayor = msg;
      return false;
      
    } else if ( this.currency == CONSTANTES_UTIL.CURRENCY_EURO && this.availableEUR < this.monto ){
      const msg = "El monto en EUR es mayor al que " 
          + selected.nombres + " " + selected.apellidos + " tiene disponible.";

      console.log(msg);
      
      this.bErrorMontoMayor = true;
      this.msgErrorMontoMayor = msg;
      return false;
      
    } else if ( this.currency == CONSTANTES_UTIL.CURRENCY_PESO_CO && this.availableCOP < this.monto ){
      const msg = "El monto en COP es mayor al que " 
          + selected.nombres + " " + selected.apellidos + " tiene disponible.";

      console.log(msg);
      
      this.bErrorMontoMayor = true;
      this.msgErrorMontoMayor = msg;
      return false;
      
    } else if ( !ValidatorUtils.onlyNumbers(""+this.monto) ){
      this.bErrorMontoMayor = true;
      this.msgErrorMontoMayor = 'El Monto debe ser numérico';
      return false;

    }

    this.bErrorMontoMayor = false;
    this.msgErrorMontoMayor = '';
    return true;
  }


  /**
   * Método que cerrará modal y devuelve seleccionado
   */
  validarYcerrar = ():ISeleccionUsuario => {
    
    if ( this.validForm(this.userSelected) ){

      var seleccc : ISeleccionUsuario = {
        id: this.userSelected.id,
        name: this.userSelected.nombres + " " + this.userSelected.apellidos,
        responsable: false,
        montoEntrada: this.monto,
        currency: this.currency,
        contratoId: this.contratoActual.id,
      }
      return seleccc;

    } else {
      return null;
    }
  }
  
}