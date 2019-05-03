import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { ValidatorUtils } from '../shared/_utils/validator-utils';
import { MatSnackBar } from '@angular/material';
import { CONSTANTES_UTIL } from '../shared/_utils/constantes-util';

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

  /* formulario */
  usuario:any = {};

  /** captcha */
  op1:string = "";
  op2:string = "";
  val1:number = 1;
  val2:number = 1;
  iconPrefix:string = "filter_";

  constructor(
      private router: Router,
      private userService: UsersService,
      private snackBar: MatSnackBar){
    
  }

  ngOnInit() {

    this.generateCaptcha();

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

    // JSON
    this.usuario = {
      id: CONSTANTES_UTIL.PREFFIX_USER + Date.now(),
      nombres:   ValidatorUtils.titleCase( this.nombre ),
      apellidos: ValidatorUtils.titleCase( this.apellido ),
      rol: CONSTANTES_UTIL.ROL_INVERSIONISTA,
      email: this.email,
      password: CONSTANTES_UTIL.DEFAULT_PASSWORD,
      telefono: this.telefono,
      ciudad: this.ciudad,
      direccion: this.direccion,
      hobbies: this.info,
      status: CONSTANTES_UTIL.USUARIO_INACTIVO,
      fechaCreacion: f
    }
      
    this.userService.createUser(this.usuario).then(
      () => {
        console.log('usuario creado',this.usuario);

        let snackBarRef = this.snackBar.open(
          'Usuario creado. Espere notificación de parte nuestros Administradores',
          'Entendido',
          {
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
      this.snackBar.open('Diligencie los campos obligatorios', 'X', {
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });
      return false;

    } else if ( !ValidatorUtils.onlyLetters( this.nombre ) ){
      this.snackBar.open('Campo Nombres solo admite caracteres alfabéticos', 'X', {
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });
      return false;

    } else if ( !ValidatorUtils.onlyLetters( this.apellido ) ){
      this.snackBar.open('Campo Apellidos solo admite caracteres alfabéticos', 'X', {
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });
      return false;

    } else if ( !ValidatorUtils.onlyNumbers( this.telefono ) ){
      this.snackBar.open('Campo Teléfono solo admite caracteres numéricos', 'X', {
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });
      return false;

    } else if ( !ValidatorUtils.validateEmail(this.email)){
      this.snackBar.open('Correo electrónico tiene formato inválido', 'X', {
        duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
      });
      return false;
    }

    return true;
  }

}