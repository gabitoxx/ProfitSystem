import { Component, OnInit, ElementRef } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { IUser } from 'src/app/interfaces/IUser';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  /*
   * Datos del usuario logueado
   */
  user: IUser;

  //
  passw:string = "";
  rep_passw:string = "";
  tooglePassw:boolean = false;
  
  /*
   * {'lock', 'lock_open'}
   * {'visibility_off', 'visibility'}
   */
  iconPassw: string = "visibility_off";

  /*
   * {'text', 'password'}
   */
  typePassw: string = "password";

  /** snackbar styles */
  configError:   MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;

  
  constructor(
      private element: ElementRef,
      private router: Router,
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
    console.log("XXX.1!")
    /** XXX id quemado */
    var userId = 'U_1556747231088';
    this.userService.getUserById(userId).valueChanges().subscribe(
        (userFirebase: IUser) => {
          this.user = userFirebase; console.log("XXX.2 userFirebase:" , userFirebase);
        }
    );
  }

  /**
   * Actualiza el primer formulario
   */
  updatePerfil(){

    this.user.nombres   = ValidatorUtils.titleCase( this.user.nombres );
    this.user.apellidos = ValidatorUtils.titleCase( this.user.apellidos );
    this.user.ciudad    = ValidatorUtils.titleCase( this.user.ciudad );

    this.userService.editUser( this.user ).then(
        () => {
          this.snackBar.open(CONSTANTES_UTIL.SUCCESS_CAMBIOS_GUARDADOS, 'Ok', this.configSuccess);
        },
        (error) => {
          this.snackBar.open(CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'X', this.configError);
        }
    );
  }

  tooglePassword(){
    this.tooglePassw = !this.tooglePassw;
    this.iconPassw = ( this.tooglePassw == true ) ? 'visibility' : 'visibility_off';
    this.typePassw = ( this.tooglePassw == true ) ? 'text'       : 'password';
  }

  updatePassword(){

    if ( this.passw == this.rep_passw ){
      alert("actualizar por Firebase_Auth ?")

    } else {
      this.snackBar.open(CONSTANTES_UTIL.ERROR_PASSWORDS_NO_COINCIDEN, 'X', this.configError);
    }

  }

  updateProfilePicture(){}
}
