import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { AccountService } from 'src/app/services/account.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { IAccount } from 'src/app/interfaces/IAccount';
import { IContract } from 'src/app/interfaces/IContract';
import { ContractService } from 'src/app/services/contract.service';
import { IUser } from 'src/app/interfaces/IUser';
import { UsersService } from 'src/app/services/users.service';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';

@Component({
  selector: 'app-create-trading',
  templateUrl: './create-trading.component.html',
  styleUrls: ['./create-trading.component.css']
})
export class CreateTradingComponent implements OnInit {

  fecha: Date = null;
  fechaHoy: Date = null;

  /* Form */
  currency:string = CONSTANTES_UTIL.CURRENCY_DOLAR;
  account:string = "";
  debito:number = 0.0;
  calculoOperacionUSD:number = 0.0;
  calculoOperacionEUR:number = 0.0;
  calculoOperacionCOP:number = 0.0;


  /* Cuentas */
  accounts:IAccount[] = [];
  accountSelected:IAccount = null;
  accountAvailableUSD:number = 0.0;
  accountAvailableEUR:number = 0.0;
  accountAvailableCOP:number = 0.0;

  /** Contratos: TODOS y los de la Cuenta seleccionada */
  contracts:IContract[] = [];
  accountSelectedContracts:IContract[] = [];

  //
  users: IUser[] = [];

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;

  
  constructor(
      private router: Router,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private accountService: AccountService,
      private contractService: ContractService,
      private userService: UsersService){

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
    this.fecha = this.fechaHoy = new Date( Date.now() );

    this.loadUsers();
    this.loadContratos();
    this.loadCuentas();
  }


  loadCuentas = () => {
    this.accountService.getAccounts().valueChanges().subscribe(
      ( data: IAccount[] ) => {
        this.accounts = data;
        
      }, (error) => {
        console.error('CreateTradingComponent.loadCuentas() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }

  loadContratos = () => {
    this.contractService.getContracts().valueChanges().subscribe(
      ( data: IContract[] ) => {
        this.contracts = data;
        
      }, (error) => {
        console.error('CreateTradingComponent.loadContratos() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }

  loadUsers() {
    this.userService.getUsers().valueChanges().subscribe(
      ( data: IUser[] ) => {
        this.users = data;
        
      }, (error) => {
        console.error('CreateContractComponent.loadUsers() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }

  selectedAccount(cuentaId: string){
    
    var c:IAccount;
    this.accountSelectedContracts = [];

    recorrerCuentas:
    for ( var i = 0; i < this.accounts.length; i++ ){
      if ( this.accounts[i].id == cuentaId ){
        c = this.accounts[i];
        break;
      }
    }
    this.accountSelected = c;
    this.accountAvailableUSD = c.saldoUSD;
    this.accountAvailableEUR = c.saldoEUR;
    this.accountAvailableCOP = c.saldoCOP;

    var msgContratos = '';

    recorrerContratos:
    for ( var i = 0; i < this.contracts.length; i++ ){
      if ( this.contracts[i].cuentaId == cuentaId ){
        this.accountSelectedContracts.push( this.contracts[i] );
      }
    }
  }


  /**
   * Actualizando automaticamente la operacion
   */
  focusOperacion = () => {

    // re-inicializacion
    this.calculoOperacionUSD = this.accountSelected.saldoUSD;
    this.calculoOperacionEUR = this.accountSelected.saldoEUR;
    this.calculoOperacionCOP = this.accountSelected.saldoCOP;

    // calcula segun el currency
    if ( this.currency == CONSTANTES_UTIL.CURRENCY_DOLAR ){
      this.calculoOperacionUSD = this.accountSelected.saldoUSD + this.debito;

    } else if ( this.currency == CONSTANTES_UTIL.CURRENCY_EURO ){
      this.calculoOperacionEUR = this.accountSelected.saldoEUR + this.debito;

    } else if ( this.currency == CONSTANTES_UTIL.CURRENCY_PESO_CO ){
      this.calculoOperacionCOP = this.accountSelected.saldoCOP + this.debito;
    }
  }


  verMasDetalles(contratoId:string){
    for ( var i = 0; i < this.contracts.length; i++ ){
      if ( this.contracts[i].id == contratoId ){
        var c:IContract = this.contracts[i];
        var u:IUser = ValidatorUtils.getUsuario(c.responsableId, this.users);
        alert("Contrato: \nID: " + c.id 
            + "\nNombre: " + c.nombre
            + "\nNº Inversionistas: " + c.inversionistas.length
            + "\nPorcentaje Rentabilidad: " + c.porcentaje + "%"
            + "\nResponsable: " + u.nombres + " " + u.apellidos
            + "\nDía de Corte: " + c.diaCorteMes
            + "\n_____________________"
            + "\nCapital del Contrato:"
            + "\nUSD: " + CONSTANTES_UTIL.MONEDA_USD + " " + c.capitalContratoUSD
            + "\nEUR: " + CONSTANTES_UTIL.MONEDA_EUR + " " + c.capitalContratoEUR
            + "\nCOP: " + CONSTANTES_UTIL.MONEDA_COP + " " + c.capitalContratoCOP
            + "\n_____________________"
            + "\nConstates de Deuda diaria:"
            + "\nUSD: " + CONSTANTES_UTIL.MONEDA_USD + " " + c.constanteDeudaUSD
            + "\nEUR: " + CONSTANTES_UTIL.MONEDA_EUR + " " + c.constanteDeudaEUR
            + "\nCOP: " + CONSTANTES_UTIL.MONEDA_COP + " " + c.constanteDeudaCOP
        );
        break;
      }
    }
  }


  newTrading(){
    alert('1. Crear Movimiento en la BD, 2.  Snackbar avisando creacion exitosa (podrá verse todos los tradings en la pág de consulta de Movimientos) y volver a pág de inicio');
    this.goHome();
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }
}
