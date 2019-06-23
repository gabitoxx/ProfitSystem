import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UsersService } from 'src/app/services/users.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';
import { IUser } from 'src/app/interfaces/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { LoginComponent } from 'src/app/login/login.component';



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
  bProcesandoCreacion:boolean = false;

  /** validacion correo */
  usuariosTodos:IUser[] = [];
  bErrorEmailRepetido = false;
  msgErrorEmailRepetido  = '';

  /** snackbar styles */
  configError:   MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  bError:boolean = false;
  msgError:string = '';

  constructor(
      private router: Router,
      private userService: UsersService,
      private snackBar: MatSnackBar,
      private authService: AuthService){
  
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
    this.loadUsuarios();
  }

  createNewUser = () => {
    //alert('1. Crear usuario en la BD, 2. Ver si se puede notificar por email, 3. Snackbar avisando creacion exitosa (podrá verse todos los usuarios en la pág de consulta de usuarios) y volver a pág de inicio');

    if ( !this.validarForm() ){
      return false;
    }

    // current date
    const f = ValidatorUtils.getFechaFormato1();

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
      email: '',
      password: CONSTANTES_UTIL.DEFAULT_PASSWORD,
      telefono: this.telefono,
      ciudad: this.ciudad,
      direccion: this.direccion,
      hobbies: this.info,
      status: CONSTANTES_UTIL.USUARIO_ACTIVO,
      fechaCreacion: f,
      contratoId: '',
      avatar: '',
      avatarURL: '',
      saldoDisponibleUSD: 0,
      saldoDisponiblePorInteresesUSD: 0,
      saldoDisponibleEUR: 0,
      saldoDisponiblePorInteresesEUR: 0,
      saldoDisponibleCOP: 0,
      saldoDisponiblePorInteresesCOP: 0,
      fechaUltimoPago: 0,
      suscripcionActivo: ( rol == CONSTANTES_UTIL.ROL_ACADEMIA ) ? true : false,
      suscripcionFechaVence: 0,
      fbId: ''
    }
    
    this.bProcesandoCreacion = true;
    this.bError = false;

    this.authService.registerWithEmail( this.email, CONSTANTES_UTIL.DEFAULT_PASSWORD )
    .then(
        (data) => {
          console.log("fb.data", data);

          /* Crear el user en BD interna */
          this.usuario.fbId = data.user.uid;
          this.usuario.email= data.user.email;

          this.userService.createUser( this.usuario ).then(
              () => {
                console.log('usuario creado',this.usuario);

                this.bProcesandoCreacion = false;

                this.authService.sendPasswordResetEmail( this.usuario.email )
                    .then(function() {

                      /* Password reset email sent. 
                      let snackBarRef = this.snackBar.open(
                        'Usuario creado. Puede verlo en la opción "Ver Usuarios". Le fue enviado correo de Creación de Contraseña',
                        'Entendido', this.configSuccess
                      );
                      snackBarRef.onAction().subscribe(
                        () => { this.goHome(); });
                      */
                      this.bError = true;
                      this.msgError = 'Usuario creado. Puede verlo en la opción "Ver Usuarios". Le fue enviado correo de Creación de Contraseña';

                      // 6 segundos
                      window.setTimeout(() => {
                        this.goHome();
                      }, 6000);

                    }).catch( function(error) {
                      /*
                      this.snackBar.open(CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS + ". No fue posible enviarle el correo al Usuario, a su cuenta " + this.usuario.email,
                        'Lo intentaré luego', this.configError + 2000);
                      */
                      this.bError = true;
                      this.msgError = CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS + ". No fue posible enviarle el correo al Usuario, a su cuenta " + this.usuario.email;

                      console.error(this.usuario.email, error);
                    })
                ;
                
              },
              (error) => {
                console.error("Firebase: NO se puede crear Usuario: ", error);
                this.snackBar.open("Creación de Usuario fallida: " + CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'Ok', this.configError);
              }
          );
        }
    ).catch(
      (error) => {
        console.error('RequestCredentialsComponent.solicitarCuenta() - Ocurrió un error en el registro:', error);
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

    } else if ( this.bErrorEmailRepetido ){
      this.snackBar.open('Email ya registrado en el Sistema. Debe ingresar otro.', 'Probaré con otro', {
        panelClass: ['snackbar-accion-failure'],
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });
      return false;
    }

    return true;
  }

  loadUsuarios = () => {
    this.userService.getUsers().valueChanges().subscribe(
        ( data: IUser[] ) => {
          this.usuariosTodos = data;
        }, (error) => {
          console.error("CreateUserComponent - validarUnicoEmail() - ERROR", error);
        }
    );
  }

  validarUnicoEmail = () => {

    this.bErrorEmailRepetido = false;
    this.msgErrorEmailRepetido  = '';

    if ( this.usuariosTodos.length > 0 ){
      for ( var i = 0; i < this.usuariosTodos.length; i++){
        if ( this.email == this.usuariosTodos[i].email ){
          this.bErrorEmailRepetido = true;
          this.msgErrorEmailRepetido  = 'Email ya registrado en el Sistema. Debe ingresar otro.';
          break;
        }
      }
    }
  }
}
