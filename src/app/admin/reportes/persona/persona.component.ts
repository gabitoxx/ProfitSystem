import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { IUser } from 'src/app/interfaces/IUser';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';
import { PaymentService } from 'src/app/services/payment.service';
import { IPayment } from 'src/app/interfaces/IPayment';
import { ContractService } from 'src/app/services/contract.service';
import { IInvestor } from 'src/app/interfaces/IInvestor';
import { IContract } from 'src/app/interfaces/IContract';
import { AccountService } from 'src/app/services/account.service';
import { IAccount } from 'src/app/interfaces/IAccount';
import { ITrading } from 'src/app/interfaces/ITrading';
import { TradingService } from 'src/app/services/trading.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {
  
  INV:string = CONSTANTES_UTIL.ROL_INVERSIONISTA;
  ADM:string = CONSTANTES_UTIL.ROL_ADMIN;

  users:IUser[] = [];
  invSelected:IUser = null;
  admSelected:IUser = null;

  inversioonista:string;
  admini:string;

  /*
   * Objetos que se llenan si se selecciona Inversionista
   */
  bInvSelected:boolean = false;
  contratoSelected:IContract = null;
  
  /*
   * Objetos que se llenan si se selecciona ADMIN.
   */
  bAdmSelected:boolean = false;
  bGestor:boolean = false;
  msgGestor:string = '';

  /** Listas */
  pagos:IPayment[] = [];
  contratos:IContract[] = [];
  accounts:IAccount[] = [];
  movimientos:ITrading[] = [];

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  
  // Mensaje de error
  bNoContent:boolean = false;
  msgNoContent: string = '';

  // Contratos mensaje
  msgContrato: string = '';

  constructor(
      private router: Router,
      private snackBar: MatSnackBar,
      private userService: UsersService,
      private paymentService: PaymentService,
      private contractService: ContractService,
      private accountService: AccountService,
      private tradingService: TradingService){

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
    //this.loadUsers();
    this.loadUsersAlfabeticamente();
    this.loadCuentas();
    this.loadContratos();
  }

  loadUsers() {
    this.userService.getUsers().valueChanges().subscribe(
      ( data: IUser[] ) => {
        this.users = data;
        
      }, (error) => {
        console.error('PersonaComponent.loadUsers() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Intentaré luego', this.configError);
      }
    );
  }
  
  loadCuentas() {
    this.accountService.getAccounts().valueChanges().subscribe(
      ( data: IAccount[] ) => {
        this.accounts = data;
        
      }, (error) => {
        console.error('UsersComponent.reloadTables() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }

  async loadUsersAlfabeticamente(){
    this.users = await this.userService.getUsersOrdered();
  }

  public async selectedInvestor(userId:string){
    
    this.admSelected = null;
    this.contratoSelected = null;
    this.invSelected = ValidatorUtils.getUsuario( userId, this.users );
    
    this.bInvSelected = true;
    this.bAdmSelected = false;
    this.admini = '';
    this.msgContrato = '';
    this.bGestor = false;
    this.msgGestor = '';
    this.movimientos = [];

    /** qué pagos ha registrado */
    this.pagos = await this.paymentService.getPagosDeUsuario( userId );

    /* buscarlo en los Contratos */
    if ( this.contratos.length > 0 ){

      this.contratoSelected = null;

      for ( var i = 0; i < this.contratos.length; i++ ){
        if ( this.invSelected.contratoId == this.contratos[i].id ){
          this.contratoSelected = this.contratos[i];
          break;
        }
      }

      if ( this.contratoSelected == null ){
        this.msgContrato = 'No está asociado a ningún Contrato.';
      } else {
        this.msgContrato = 'Se encuentra asociado al siguiente Contrato:';
      }
    } else {
      this.bNoContent = true;
      this.msgNoContent = 'No se cargaron los Contratos (posible falla con el Internet)';
    }

  }

  loadContratos() {
    this.contractService.getContracts().valueChanges().subscribe(
      ( data: IContract[] ) => {
        this.contratos = data;

      }, (error) => {
        console.error('PersonaComponent.loadContracts() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }


  public async selectedAdmin(userId:string){
    
    this.bAdmSelected = true;
    this.bInvSelected = false;
    this.inversioonista = '';
    this.msgContrato = '';
    this.pagos = [];
    this.admini = '';
    this.msgContrato = '';

    this.contratoSelected = null;
    this.invSelected = null;

    this.admSelected = ValidatorUtils.getUsuario( userId, this.users );
    this.movimientos = [];
    
    this.esGestorDe( userId );

    this.movimientos = await this.tradingService.getMovimientosDeAdmin( userId );
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }

  getNombrePersona(id:string){
    return ValidatorUtils.getUsuarioNombre(id, this.users);
  }

  esGestorDe = (adminId:string) => {
    this.bGestor = false;
    this.msgGestor = '';

    recorrerCuentas:
    for ( var i = 0; i < this.accounts.length; i++ ){
      if ( adminId == this.accounts[i].gestorId ){
        this.bGestor = true;
        this.msgGestor = "Cuenta " + this.accounts[i].nombre + " (" + this.accounts[i].descripcion + ")";
        break;
      }
    }
  }
}
