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
import { ISeleccionUsuario } from 'src/app/interfaces/ISeleccionUsuario';
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
  entraMonto: number;
  entraMoneda: string;
}

const MODAL_ANCHO:string = '550px';
const MODAL_ALTO:string = '90%';

var ELEMENT_DATA: PeriodicElement[] = [
  {id: '1', porc_diario: 0.7, name: 'Pepito PErez', porcentaje: 20, responsable: 'No', entraMonto: 0, delete: 'X', entraMoneda: 'USD'},
  {id: '2', porc_diario: 0.4, name: 'Gab Sanchez', porcentaje: 15, responsable: 'No', entraMonto: 0, delete: 'X', entraMoneda: 'USD'},
  {id: '3', porc_diario: 0.3, name: 'Darth Vader', porcentaje: 10, responsable: CONSTANTES_UTIL.SI, entraMonto: 0, delete: 'X', entraMoneda: 'USD'},
  {id: '4', porc_diario: 0.1, name: 'Harry Potter', porcentaje: 5, responsable: 'No', entraMonto: 0, delete: 'X', entraMoneda: 'USD'},
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
  bErrorPorcentaje:boolean = false;
  msgErrorPorcentaje:string = '';

  constanteUSD: number = 0;
  constanteEUR: number = 0;
  constanteCOP: number = 0;

  /* Tabla: columnas a mostrar */
  displayedColumns: string[] = ['name', /*'porcentaje', 'porc_diario',*/ 'responsable', 'entraMonto', 'delete'];
  dataSource = [];

  capitalContratoUSD:number = 0.0;
  capitalContratoEUR:number = 0.0;
  capitalContratoCOP:number = 0.0;

  /** lista de usuarios para el Modal y los seleccionados */
  users: IUser[];
  inversionistas: PeriodicElement[] = [];

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  
  bPensando:boolean = false;

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
    for ( var i = 0; i < this.accounts.length; i++ ){
      if ( this.accounts[i].id == cuentaId ){
        c = this.accounts[i];
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

        } else {
          /* si es el que quiero eliminar, actualizar el capital */
          this.actualizarCapitalContrato( this.inversionistas[i], false );
        }
      }

      this.dataSource     = data;
      this.inversionistas = data;

      this.focusPorcFunction();
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

      console.log('The dialog was closed:', result);

      if ( result ){
        var nuevo:PeriodicElement = {
          id: result.id, 
          name: result.name, 
          responsable: (result.responsable) ? CONSTANTES_UTIL.SI : CONSTANTES_UTIL.NO,
          delete: 'X',
          porc_diario: 0,
          porcentaje: 1,
          entraMonto: result.montoEntrada,
          entraMoneda: result.currency,
        }

        var data:PeriodicElement[] = [];

        rellenandoTabla:
        for (var i = 0; i < this.inversionistas.length; i++){
          data.push( this.inversionistas[i] );
        }

        // añadiendo nuevo
        data.push( nuevo );

        // refrescar tabla html y arreglo 
        this.dataSource = data;
        this.inversionistas.push( nuevo );

        this.actualizarCapitalContrato( nuevo, true );

        this.focusPorcFunction();

      } else {
        this.snackBar.open('Selección de Inversionista inválida.', 'Intentaré de nuevo', this.configError);
      }
    });
  }


  /**
   * Actualizar el capital que tiene 3 contadores
   * @param nuevo el recien seleccionado del modal
   */
  actualizarCapitalContrato = (nuevo: PeriodicElement, suma: boolean) => {
    if ( nuevo.entraMoneda == CONSTANTES_UTIL.CURRENCY_DOLAR ){
      if ( suma ){
        this.capitalContratoUSD += nuevo.entraMonto;
      } else {
        this.capitalContratoUSD -= nuevo.entraMonto;
      }
      
    } else if ( nuevo.entraMoneda == CONSTANTES_UTIL.CURRENCY_EURO ){
      if ( suma ){
        this.capitalContratoEUR += nuevo.entraMonto;
      } else {
        this.capitalContratoEUR -= nuevo.entraMonto;
      }

    } else if ( nuevo.entraMoneda == CONSTANTES_UTIL.CURRENCY_PESO_CO ){
      if ( suma ){
        this.capitalContratoCOP += nuevo.entraMonto;
      } else {
        this.capitalContratoCOP -= nuevo.entraMonto;
      }
    }
  }

  
  /**
   * validar form
   * validar repetidos y 1 responsable
   * crear entidad en Firebase
   * actualizar el usuario responsable con este contratoID
   */
  newContract(){
    //alert('1. Crear Contrato en la BD, 2. ver si se puede enviar email con creacion de contrato para registros 3.  Snackbar avisando creacion exitosa (podrá verse todAs lAs cuentas en la pág de consulta de Cuentas) y volver a pág de inicio');

    if ( !this.validarForm() ){
      return;
    }

    this.bPensando = true;
    
    //
    const milsecs = Date.now();

    // Recorrer los Inversores
    var invests:IInvestor[] = [];

    var responsableID:string = '';
    var responsableAporteMonto:number = 0;
    var responsableAporteMoneda:string = '';

    for ( var i = 0; i < this.inversionistas.length; i++ ){
      
      var current: IInvestor = {
        id: this.inversionistas[i].id,
        activo: true,
        fechaActivo: milsecs,
        fechaInactivo: 0,
        responsable: ( this.inversionistas[i].responsable == CONSTANTES_UTIL.SI ) ? true : false,
        aporteMonto: this.inversionistas[i].entraMonto,
        aporteCurrency: this.inversionistas[i].entraMoneda,
      }
      invests.push( current );

      if ( this.inversionistas[i].responsable == CONSTANTES_UTIL.SI ){
        responsableID = this.inversionistas[i].id;
        responsableAporteMonto  = this.inversionistas[i].entraMonto;
        responsableAporteMoneda = this.inversionistas[i].entraMoneda;
      }
    }

    // new entity
    var contratoId = CONSTANTES_UTIL.PREFFIX_CONTRATC + milsecs;

    var contrato:IContract = {
      id: contratoId,
      nombre: this.contractName,
      cuentaId: this.accountSelected.id,
      estatusActivo: true,

      //
      fechaCreacion: ValidatorUtils.getFechaFormato1(),
      fechaCreacionMillisecs: milsecs,
      
      // form
      diaCorteMes: this.day,
      porcentaje: this.prpm,
      responsableId: responsableID,

      // Arreglo de inversionistas
      inversionistas: invests,

      // $
      capitalContratoUSD: this.capitalContratoUSD,
      constanteDeudaUSD: this.constanteUSD,
      // EUR
      capitalContratoEUR: this.capitalContratoEUR,
      constanteDeudaEUR: this.constanteEUR,
      // COP
      capitalContratoCOP: this.capitalContratoCOP,
      constanteDeudaCOP: this.constanteCOP,
    }

    console.log('contrato:::',contrato);

    //servicio
    this.contractService.createContract( contrato ).then(
        () => {
          console.log('Contrato creado ');

          this.actualizarUsuarioContrato( contratoId, responsableID, invests, responsableAporteMonto, responsableAporteMoneda );
          
        }, (error) => {
          console.error("Firebase: NO se puede crear CONTRATO: ", error);
          this.snackBar.open("Creación de Contrato fallido: " + CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'Ok', this.configError);
        }
    );
    
  }


  /**
   * 
   * @param contratoId    contract.id
   * @param responsableID user.id
   * @param invests  Arreglo de inversores 
   * @param responsableAporteMonto   el monto con el que entra el responsable
   * @param responsableAporteMoneda  el tipo de currency con el que entra el responsable
   */
  actualizarUsuarioContrato(contratoId: string, responsableID: string, invests:IInvestor[],
    responsableAporteMonto:number, responsableAporteMoneda:string) {
    
    var u:IUser = ValidatorUtils.getUsuario(responsableID, this.users);

    u.contratoId = contratoId;
    
    // actualizar el disponible SOLO del Responsable
    if ( responsableAporteMoneda == CONSTANTES_UTIL.CURRENCY_DOLAR ){
      u.saldoDisponibleUSD -= responsableAporteMonto;

    } else if ( responsableAporteMoneda == CONSTANTES_UTIL.CURRENCY_EURO ){
      u.saldoDisponibleEUR -= responsableAporteMonto;

    } else if ( responsableAporteMoneda == CONSTANTES_UTIL.CURRENCY_PESO_CO ){
      u.saldoDisponibleCOP -= responsableAporteMonto;
    }

    this.userService.editUser( u ).then(
        () => {
          console.log("CreateContractComponent - actualizarUsuarioContrato() - OK - Usuario id:" + responsableID 
              + " actualizado con su ContratoId: " + contratoId);

          this.actualizarSaldoCuenta( invests, responsableID);

        }, (error) => {
          console.error("CreateContractComponent - actualizarUsuarioContrato() - ERROR:", contratoId, responsableID, error);
        }
    );
  }
  
  actualizarSaldoCuenta(inversoresArray: IInvestor[], responsableId: string) {
    
    // actualizar en todos los currencies
    this.accountSelected.saldoUSD += this.capitalContratoUSD;
    this.accountSelected.saldoEUR += this.capitalContratoEUR;
    this.accountSelected.saldoCOP += this.capitalContratoCOP;

    this.accountService.editAccount( this.accountSelected ).then(
        () => {
          console.log("CreateContractComponent - actualizarSaldoCuenta() - OK - SALDOS de Cuenta actualizados (id:" + this.accountSelected.id + ")");

          // actualizar los Disponibles de los demás Inversionistas
          this.restarDelDisponible( inversoresArray, responsableId );

          let snackBarRef = this.snackBar.open(
            'Contrato creado. Puede verlos en el menú "Ver Contratos"',
            'Entendido', this.configSuccess
          );

          snackBarRef.onAction().subscribe(() => { this.goHome(); });

          // 5 segundos
          window.setTimeout(() => { this.goHome(); }, 5000);

        }, (error) => {
          console.error("CreateContractComponent - actualizarSaldoCuenta() - ERROR:", error, this.accountSelected);
        }
    );

  }

  restarDelDisponible = (invests: IInvestor[], responsableId: string) => {
    
    var u:IUser;

    recorrerInversores:
    for ( var i = 0; i < invests.length; i++ ){
      if ( invests[i].id != responsableId ){
        /** 
         * ya el responsable se actuaizó en actualizarUsuarioContrato()
         * Acá toca actualizar los disponibles de los otros
         */
        u = ValidatorUtils.getUsuario( invests[i].id, this.users);

        if ( invests[i].aporteCurrency == CONSTANTES_UTIL.CURRENCY_DOLAR ){
          u.saldoDisponibleUSD -= invests[i].aporteMonto;

        } else if ( invests[i].aporteCurrency == CONSTANTES_UTIL.CURRENCY_EURO ){
          u.saldoDisponibleEUR -= invests[i].aporteMonto;

        } else if ( invests[i].aporteCurrency == CONSTANTES_UTIL.CURRENCY_PESO_CO ){
          u.saldoDisponibleCOP -= invests[i].aporteMonto;
        }

        this.userService.editUser( u );
      }
    }

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

    } else if ( this.constanteUSD < 0 || this.constanteEUR < 0 || this.constanteCOP < 0 ){
      this.snackBar.open('Alguna constante resultó negativa. Validar los datos.', 'Ok', this.configError);
      return false;
    }
    
    var countResp:number = 0;

    contarResponsables:
    for (var i = 0; i < this.inversionistas.length; i++){
      if ( this.inversionistas[i].responsable == CONSTANTES_UTIL.SI ){
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

    // buscar que no haya Inversionistas repetidos
    var rep = this.hayInversionistasRepetidos();
    if ( rep != '' ){
      this.snackBar.open("Inversionista " + rep + " está repetido. Elimine los registros y rehaga la selección de Inversionistas.", 'Ok', this.configError);
      return false;
    }

    // ha pasado todas las validaciones
    return true;
  }

  hayInversionistasRepetidos = ():string => {
    
    var pivote:PeriodicElement = null;
    var burbuja:PeriodicElement = null;

    for ( var i = 0; i < this.inversionistas.length; i++ ){
      pivote = this.inversionistas[i];

      for ( var j = i + 1; j < this.inversionistas.length; j++ ){
        burbuja = this.inversionistas[j];

        if ( pivote.id == burbuja.id ){
          return pivote.name;
        }
      }
    }
    return '';
  }


  /**
   * Fórmula ecuación de la constante
   */
  focusPorcFunction = () => {
    console.log("focusPorcFunction")

    if ( this.prpm <= 0 || this.prpm > 100 ){
      this.bErrorPorcentaje = true;
      this.msgErrorPorcentaje = 'Porcentaje debe ser entre 0 y 100';
  
    } else {
      this.bErrorPorcentaje = false;
      this.msgErrorPorcentaje = '';

      // porcentaje a 1
      var porc = ( this.prpm / 100 );

      // ecuación para cada moneda
      this.constanteUSD = ( this.capitalContratoUSD * porc ) / CONSTANTES_UTIL.DIVISOR_CONSTANTE_PRPM;
      this.constanteEUR = ( this.capitalContratoEUR * porc ) / CONSTANTES_UTIL.DIVISOR_CONSTANTE_PRPM;
      this.constanteCOP = ( this.capitalContratoCOP * porc ) / CONSTANTES_UTIL.DIVISOR_CONSTANTE_PRPM;
    }
  }

}

/**********************************************************************************************************/
@Component({
  selector: 'dialog-modal-add-investor',
  templateUrl: 'dialog-modal-add-investor.html',
})
export class AddInvestorModalDialog {

  correo: string   = "";
  telef: string = "";
  monto: number = 0.0;
  currency: string = 'USD';
  responsability: boolean = false;

  // solo para que compile
  inv_person:string='';

  users2: IUser[];
  users: IUser[];
  userSelected: IUser = null;

  availableUSD: number = 0.0;
  availableEUR: number = 0.0;
  availableCOP: number = 0.0;
  
  /* Validaciones */
  bErrorMontoMayor = false;
  msgErrorMontoMayor = '';
  

  constructor(
    public dialogRef: MatDialogRef<AddInvestorModalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IDialogData) {

      console.log("data.users", data.users);
      this.users2 = data.users;

      this.userSelected = this.users2[0];
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


  toogleResponsabilidad = (ob: MatSlideToggleChange) => {
    console.log("ob",ob.checked)
    if ( null == this.userSelected || undefined == this.userSelected ){
      this.responsability = false;
    } else {
      this.userSelected.responsable = ob.checked;
      this.responsability = ob.checked;
    }
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
        responsable: this.responsability,
        montoEntrada: this.monto,
        currency: this.currency,
      }
      return seleccc;

    } else {
      return null;
    }
  }
  
}