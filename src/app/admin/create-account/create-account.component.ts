import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UsersService } from 'src/app/services/users.service';
import { IUser } from 'src/app/interfaces/IUser';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { IAccount } from 'src/app/interfaces/IAccount';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateAccountComponent implements OnInit {

  // formulario
  cuenta: IAccount;

  //
  admins: IUser[];
  ADM:string = CONSTANTES_UTIL.ROL_ADMIN;

  /** snackbar styles */
  configError:   MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  

  constructor(
      private router: Router,
      private snackBar: MatSnackBar,
      public dialog: MatDialog,
      private userService: UsersService,
      private accountService: AccountService,){

    this.configError = {
      panelClass: ['snackbar-accion-failure'],
      duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
    };
    
    this.configSuccess = {
      panelClass: ['snackbar-accion-succes'],
      duration: CONSTANTES_UTIL.SNACKBAR_DURATION_SUCCESS,
    };

    this.userService.getUsers().valueChanges().subscribe(
      ( data: IUser[] ) => {
        
        this.admins = data;
        
      }, (error) => {
        console.error('CreateAccountComponent.constructor() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );

    // inicializando interface del formulario
    this.cuenta = {
      id: '',
      nombre: '',
      descripcion: '',
      currency:  '',
      available: 0,
      gestorId:  '',
      estatusActivo: false,
      fechaCreacion: ''
    }

  }

  ngOnInit() {
  }

  createNewAccount(){
    //alert('1. Crear Cuenta en la BD, 2.  Snackbar avisando creacion exitosa (podrá verse todAs lAs cuentas en la pág de consulta de Cuentas) y volver a pág de inicio');

    if ( !this.validarForm() ){
      return false;
    }

    /*
     * Formatear JSON
     */
    this.cuenta.id = CONSTANTES_UTIL.PREFFIX_ACCOUNT + Date.now();
    this.cuenta.nombre = ValidatorUtils.titleCase( this.cuenta.nombre );
    this.cuenta.estatusActivo = true;

    // current date
    const f = ValidatorUtils.getFechaFormato1();
    this.cuenta.fechaCreacion = f;
    
    console.log('this.cuenta=>', this.cuenta);
    
    //servicio
    this.accountService.createAccount(this.cuenta).then(
        () => {
          console.log('Cuenta creada: ',this.cuenta);

          let snackBarRef = this.snackBar.open(
            'Cuenta creada. Puede verlas todas en "Ver Cuentas"',
            'Entendido', this.configSuccess
          );

          snackBarRef.onAction().subscribe(() => { this.goHome(); });
          
          // 3 segundos
          window.setTimeout(() => { this.goHome(); }, 3000);
          
        }, (error) => {
          console.error("Firebase: NO se puede crear CUENTA: ", error);
          this.snackBar.open("Creación de Cuenta fallida: " + CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'Ok', this.configError);
        }
    );
  }


  validarForm() {
    
    if ( this.cuenta.nombre.trim() == "" ){
      this.snackBar.open('Nombre de la cuenta es requerido.', 'Ok', this.configError);
      return false;
    } else if ( this.cuenta.descripcion.trim() == "" ){
      this.snackBar.open('Indique alguna descripción.', 'Ok', this.configError);
      return false;
    } else if ( this.cuenta.currency.trim() == "" ){
      this.snackBar.open('Elija un tipo de Moneda.', 'Ok', this.configError);
      return false;
    } else if ( this.cuenta.gestorId.trim() == "" ){
      this.snackBar.open('Un Gestor es Obligatorio.', 'Ok', this.configError);
      return false;
    } else if ( this.cuenta.available < 0.0 ){
      this.snackBar.open('No se permiten montos negativos.', 'Ok', this.configError);
      return false;
    }

    return true;
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }
}
