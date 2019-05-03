import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UsersService } from 'src/app/services/users.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';
import { IUser } from 'src/app/interfaces/IUser';



@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  nombre:string = "";
  apellido:string = "";
  email:string = "";
  telefono:string = "";
  ciudad:string = "";
  direccion:string = "";
  info:string = "";
  rol:string = "";

  /* formulario */
  usuario: IUser;

  /** snackbar styles */
  configError:   MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  
  constructor(
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
  }

  createNewUser = () => {
    //alert('1. Crear usuario en la BD, 2. Ver si se puede notificar por email, 3. Snackbar avisando creacion exitosa (podrá verse todos los usuarios en la pág de consulta de usuarios) y volver a pág de inicio');

    if ( !this.validarForm() ){
      return false;
    }

    // current date
    let date = new Date();
    const y = date.getFullYear();
    const m = ( date.getMonth() + 1 );
    const d = date.getDate();
    const f = d + CONSTANTES_UTIL.DATE_SEPARATOR + m + CONSTANTES_UTIL.DATE_SEPARATOR + y;

    // Rol
    let rol:string = "";
    if ( this.rol == 'i' ){         rol = CONSTANTES_UTIL.ROL_INVERSIONISTA;
    } else if ( this.rol == 'x' ){  rol = CONSTANTES_UTIL.ROL_ADMIN;
    } else if ( this.rol == 'a' ){  rol = CONSTANTES_UTIL.ROL_INVERSIONISTA;
    } else if ( this.rol == 'e' ){  rol = CONSTANTES_UTIL.ROL_ACADEMIA;
    } else {                        rol = CONSTANTES_UTIL.ROL_INVERSIONISTA;
    }

    // JSON + Interace
    this.usuario = {
      id: CONSTANTES_UTIL.PREFFIX_USER + Date.now(),
      nombres:   ValidatorUtils.titleCase( this.nombre ),
      apellidos: ValidatorUtils.titleCase( this.apellido ),
      rol: rol,
      email: this.email,
      password: CONSTANTES_UTIL.DEFAULT_PASSWORD,
      telefono: this.telefono,
      ciudad: this.ciudad,
      direccion: this.direccion,
      hobbies: this.info,
      status: CONSTANTES_UTIL.USUARIO_ACTIVO,
      fechaCreacion: f
    }
    
    this.userService.createUser(this.usuario).then(
      () => {
        console.log('usuario creado',this.usuario);

        let snackBarRef = this.snackBar.open(
          'Usuario creado. Puede verlo en la opción "Ver Usuarios"',
          'Entendido', this.configSuccess
        );

        snackBarRef.onAction().subscribe(
          () => {
            this.goHome();
          }
        );
        
        // 8 segundos
        window.setTimeout(() => {
          this.goHome();
        }, 8000);
      },
      (error) => {
        console.error("Firebase: NO se puede crear Usuario: ", error);
      }
    );
  }
  

  goHome(){
    this.router.navigate(["admin/home"]);
  }

  validarForm(){
    
    if ( this.nombre.trim() == "" || (this.apellido.trim() == "")
        || (this.email.trim() == "") || (this.telefono.trim() == "")){
      this.snackBar.open('Diligencie los campos obligatorios', 'Ok', this.configError);
      return false;

    } else if ( !ValidatorUtils.onlyLetters( this.nombre ) ){
      this.snackBar.open('Campo Nombres solo admite caracteres alfabéticos', 'Ok', this.configError);
      return false;

    } else if ( !ValidatorUtils.onlyLetters( this.apellido ) ){
      this.snackBar.open('Campo Apellidos solo admite caracteres alfabéticos', 'Ok', this.configError);
      return false;

    } else if ( !ValidatorUtils.onlyNumbers( this.telefono ) ){
      this.snackBar.open('Campo Teléfono solo admite caracteres numéricos', 'Ok', this.configError);
      return false;

    } else if ( !ValidatorUtils.validateEmail(this.email)){
      this.snackBar.open('Correo electrónico tiene formato inválido', 'Ok', this.configError);
      return false;
    }

    return true;
  }
}
