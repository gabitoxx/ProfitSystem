import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog, MatSnackBarConfig, MatSlideToggleChange } from '@angular/material';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { AccountService } from 'src/app/services/account.service';
import { IAccount } from 'src/app/interfaces/IAccount';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
 
  STATUS_ACTIVO:string   = CONSTANTES_UTIL.USUARIO_ACTIVO;
  STATUS_INACTIVO:string = CONSTANTES_UTIL.USUARIO_INACTIVO;

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  
  // Cuentas
  arrayAccounts: IAccount[];
  iAccInactivos:number = 0;
  iAccActivos:number = 0;

  //
  flagOperando:boolean = false;

  constructor(
      private router: Router,
      private accountService: AccountService,
      private snackBar: MatSnackBar,
      public dialog: MatDialog){

    //datos remotos - Observable
    this.reloadTables();

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
  }


  reloadTables() {
    this.accountService.getAccounts().valueChanges().subscribe(
      ( data: IAccount[] ) => {

        // mostrar u ocultar los paneles que dicen que no hay
        this.loopingUsersFlags(data);
        
        //data remota
        this.arrayAccounts = data;
        
      }, (error) => {
        console.error('UsersComponent.reloadTables() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }

  /**
   * NO SE USA .forEach() porque no se tiene acceso a las variables de esta clase
   */
  loopingUsersFlags(data: IAccount[]) {

    this.iAccInactivos = 0;
    this.iAccActivos = 0;

    var i:number;
    for ( i = 0; i < data.length; i++ ){

      var status = data[i].estatusActivo;
      
      if ( status == true ){  this.iAccActivos++;
      } else {                this.iAccInactivos++;
      }
    }
  }


  toogleActivation = (accountId:string, activar:boolean, ob: MatSlideToggleChange) => {

    console.log("Procedo a activar: " + activar + " el accountId: " + accountId);
    this.flagOperando = true;

    this.accountService.getAccountById(accountId).valueChanges().subscribe(
        (acc: IAccount) => {
          if (this.flagOperando == true){
            this.flagOperando = false;
          
            acc.estatusActivo = !acc.estatusActivo;

            this.accountService.editAccount(acc).then(
                (success) => {
                  var msg = (activar) ? CONSTANTES_UTIL.SUCCESS_ACCOUNT_ACTIVATED : CONSTANTES_UTIL.SUCCESS_ACCOUNT_DEACTIVATED;
                  
                  this.snackBar.open("Cuenta: " + msg, 'Ok', this.configSuccess);
                  this.reloadTables();
                
                }).catch(
                  (error) => {
                    this.snackBar.open(CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'Ok', this.configError);
                    console.error(error);
                  }
            );
          }
        }
    );
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }
}
