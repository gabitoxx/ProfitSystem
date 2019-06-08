import { Component, OnInit } from '@angular/core';
import { ITrading } from 'src/app/interfaces/ITrading';
import { Router } from '@angular/router';
import { TradingService } from 'src/app/services/trading.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UsersService } from 'src/app/services/users.service';
import { AccountService } from 'src/app/services/account.service';
import { IAccount } from 'src/app/interfaces/IAccount';
import { IUser } from 'src/app/interfaces/IUser';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';

@Component({
  selector: 'app-tradings',
  templateUrl: './tradings.component.html',
  styleUrls: ['./tradings.component.css']
})
export class TradingsComponent implements OnInit {

  displayedColumns: string[] = ['fecha', 'name', 'monto', 'by'];

  arrayTradings: ITrading[] = [];
  arrayAccounts: IAccount[] = [];
  arrayAdmins: IUser[]      = [];

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  

  constructor(
      private router: Router,
      private snackBar: MatSnackBar,
      private userService: UsersService,
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
    this.loadCuentas();
    this.loadAdmins();
    this.loadMovimientos();
  }


  goHome(){
    this.router.navigate(["admin/home"]);
  }


  loadMovimientos() {
    this.tradingService.getTradings().valueChanges().subscribe(
        ( data: ITrading[] ) => {
          this.arrayTradings = data.reverse();
        }, (error) => {
          console.error('TradingsComponent.loadMovimientos() - error:', error);
          this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
        }
    );
  }

  loadCuentas() {
    this.accountService.getAccounts().valueChanges().subscribe(
        ( data: IAccount[] ) => {
          this.arrayAccounts = data;
        }, (error) => {
          console.error('TradingsComponent.loadCuentas() - error:', error);
          this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
        }
    );
  }


  loadAdmins = () => {
    this.userService.getUsers().valueChanges().subscribe(
        ( data: IUser[] ) => {
          
          var result: IUser[] = [];

          for ( var i = 0; i < data.length; i++ ){
            if ( data[i].rol == CONSTANTES_UTIL.ROL_ADMIN ){
              result.push( data[i] );
            }
          }
          this.arrayAdmins = result;

        }, (error) => {
          console.error('TradingsComponent.loadCuentas() - error:', error);
          this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
        }
    );
  }

  getUserName(userId:string){
    return ValidatorUtils.getUsuarioNombre( userId, this.arrayAdmins );
  }

  getCuentaName(cuentaId:string){
    return ValidatorUtils.getAccountName( cuentaId, this.arrayAccounts );
  }

  /**
   * 
   * @param option {'right', 'left'}
   */
  pagination(option:string){
    if ( option == 'left' ){
      alert("Registros anteriores (TODO para la fase 2)");
    } else if ( option == 'right' ){
      alert("Registros posteriores (TODO para la fase 2)");
    }
  }
}
