import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { ValidatorUtils } from '../shared/_utils/validator-utils';
import { MatSnackBar } from '@angular/material';
import { CONSTANTES_UTIL } from '../shared/_utils/constantes-util';
import { IUser } from '../interfaces/IUser';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-request-credentials',
  templateUrl: './request-credentials.component.html',
  styleUrls: ['./request-credentials.component.css']
})
export class RequestCredentialsComponent implements OnInit {

  nombre:string = "";
  apellido:string = "";
  email:string = "";
  telefono:string = "";
  ciudad:string = "";
  direccion:string = "";
  info:string = "";
  operacion:number = 0;
  rol:string = "";

  /* formulario */
  usuario:IUser = null;
  bProcesandoCreacion:boolean = false;

  /** captcha */
  op1:string = "";
  op2:string = "";
  val1:number = 1;
  val2:number = 1;
  iconPrefix:string = "filter_";

  /** validacion correo */
  usuariosTodos:IUser[] = [];
  bErrorEmailRepetido = false;
  msgErrorEmailRepetido  = '';

  constructor(
      private router: Router,
      private userService: UsersService,
      private snackBar: MatSnackBar,
      private authService: AuthService){
    
  }

  ngOnInit() {

    this.generateCaptcha();
    this.loadUsuarios();
    //console.log("", this.val1 + this.val2)
  }

  goLogin(){
    this.router.navigate(["login"]);
  }

  solicitarCuenta = () => {
    //alert("1. Crear prospecto - 2. Enviar email a algun Admin para que apruebe la cuenta - 3. notificar a usuario por Snackbar e ir atrás");
    
    if ( this.operacion != (this.val1 + this.val2)  ){
      
      this.snackBar.open('Operación matemática incorrecta. Intente nuevamente', 'X', {
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });

      this.generateCaptcha();

      return false;
    }

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
    } else if ( this.rol == 'e' ){  rol = CONSTANTES_UTIL.ROL_ACADEMIA;
    } else {                        rol = CONSTANTES_UTIL.ROL_INVERSIONISTA;
    }

    // JSON
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
      status: CONSTANTES_UTIL.USUARIO_INACTIVO,
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
      suscripcionActivo: false,
      suscripcionFechaVence: 0,
      fbId: ''
    }
    
    this.bProcesandoCreacion = true;

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

                let snackBarRef = this.snackBar.open(
                  'Usuario creado. Espere notificación de parte nuestros Administradores',
                  'Entendido',
                  {
                    panelClass: ['snackbar-accion-succes'],
                    duration: 6000,
                  }
                );
        
                snackBarRef.onAction().subscribe(
                  () => {
                    this.router.navigate(["login"]);
                  }
                );
                
                // 8 segundos
                window.setTimeout(() => {
                  this.router.navigate(["login"]);
                }, 8000);
              },
              (error) => {
                console.error("Firebase: NO se puede crear Usuario: ", error);
                this.snackBar.open('No se pudo crear el Usuario en nuestro Sistema. Por favor, intente de nuevo más tarde.', 'Ok', {
                  panelClass: ['snackbar-accion-failure'],
                  duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
                });
              }
          );
        }
    ).catch(
      (error) => {
        console.error('RequestCredentialsComponent.solicitarCuenta() - Ocurrió un error en el registro:', error);
        this.snackBar.open('No se pudo crear el Usuario en nuestro Sistema. Por favor, intente de nuevo más tarde.', 'Ok', {
          panelClass: ['snackbar-accion-failure'],
          duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
        });
      }
    );

  }
  
  generateCaptcha(){
    this.val1 = ValidatorUtils.randomInt(1, 9);
    this.val2 = ValidatorUtils.randomInt(1, 9);

    this.op1 = this.iconPrefix + this.val1;
    this.op2 = this.iconPrefix + this.val2;
  }

  validarForm(){
    
    if ( this.nombre.trim() == "" || (this.apellido.trim() == "")
        || (this.email.trim() == "") || (this.telefono.trim() == "")){
      this.snackBar.open('Diligencie los campos obligatorios', 'Lo haré', {
        panelClass: ['snackbar-accion-failure'],
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });
      return false;

    } else if ( !ValidatorUtils.onlyLetters( this.nombre ) ){
      this.snackBar.open('Campo Nombres solo admite caracteres alfabéticos', 'Ok', {
        panelClass: ['snackbar-accion-failure'],
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });
      return false;

    } else if ( !ValidatorUtils.onlyLetters( this.apellido ) ){
      this.snackBar.open('Campo Apellidos solo admite caracteres alfabéticos', 'Ok', {
        panelClass: ['snackbar-accion-failure'],
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });
      return false;

    } else if ( !ValidatorUtils.onlyNumbers( this.telefono ) ){
      this.snackBar.open('Campo Teléfono solo admite caracteres numéricos', 'Ok', {
        panelClass: ['snackbar-accion-failure'],
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });
      return false;

    } else if ( !ValidatorUtils.validateEmail(this.email)){
      this.snackBar.open('Correo electrónico tiene formato inválido', 'Entendido', {
        panelClass: ['snackbar-accion-failure'],
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });
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
          console.error("RequestCredentialsComponent - loadU() - ERROR", error);
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