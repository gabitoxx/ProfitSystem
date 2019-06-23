import { Component, OnInit } from '@angular/core';
import { LoginValidacion } from './login.validate';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { CONSTANTES_UTIL } from '../shared/_utils/constantes-util';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [SessionService],
})
export class LoginComponent extends LoginValidacion implements OnInit {
  
  public email: string;
  public password: string;

  tooglePassw:boolean = false;
  /*
   * {'lock', 'lock_open'}
   * {'visibility_off', 'visibility'}
   */
  iconPassw: string = "visibility";
  /*
   * {'text', 'password'}
   */
  typePassw: string = "password";

  //
  bError:boolean = false;
  msgError:string = '';
  bShowSpinner:boolean = false;
  attemps:number=0;

  constructor(
      private router: Router,
      private authService: AuthService,
      private userService: UsersService,
      private session: SessionService){
    super();
  }

  ngOnInit() {
    this.getGroupValidator();
  }

  async login() {
    console.log("login.1");
    this.attemps++;
    this.bShowSpinner = true;

    this.authService.loginWithEmail( this.email, this.password ).then(
      (data) => {
        //console.log('Loggeado correctamente', data);
        console.log("login.2");
        this.fecth();
      }
    ).catch(
      (error) => {
        console.error('Ocurrió un error', error);
        //alert("Email o Contraseña incorrectos. Intente de nuevo.");
        this.bError = true;
        this.msgError = 'Email o Contraseña incorrectos. Intente de nuevo.';
        this.bShowSpinner = false;
      }
    );
    
  }

  async fecth() {
    console.log("login.3="+this.email);

    var user = await this.userService.getUsuarioByEmail( this.email );
    console.log("login.4");

    if ( !user ){
      console.log("login.null");
      if ( this.attemps >= 2 ){
        this.bError = true;
        this.msgError = 'Usuario no existe en el Sistema. Si considera esto un error, por favor contacte a nuestros Administradores Profit Takers';
        this.bShowSpinner = false;
      } else {
        this.login();
      }

    } else if ( user.status == CONSTANTES_UTIL.USUARIO_INACTIVO ){
      console.log("login.5");
      //alert("Usuario no activado aún en el Sistema. Si considera esto un error, por favor contacte a nuestros Administradores Profit Takers");
      this.bError = true;
      this.msgError = 'Usuario no activado aún en el Sistema. Si considera esto un error, por favor contacte a nuestros Administradores Profit Takers';
      this.bShowSpinner = false;

    } else {
      console.log("login.6");
      this.session.onSetItemJSON(CONSTANTES_UTIL.key, user);

      if ( user.rol == CONSTANTES_UTIL.ROL_INVERSIONISTA || user.rol == CONSTANTES_UTIL.ROL_ACADEMIA ){
        this.router.navigate(["inversionistas/home"]);
  
      } else if ( user.rol == CONSTANTES_UTIL.ROL_ADMIN ){
        this.router.navigate(["admin/home"]);
      }
    }
  }

  

  tooglePassword(){
    this.tooglePassw = !this.tooglePassw;
    this.iconPassw = ( this.tooglePassw == true ) ? 'visibility_off' : 'visibility';
    this.typePassw = ( this.tooglePassw == true ) ? 'text'           : 'password';
  }

  applyForNewUseraccount(){
    this.router.navigate(["nueva/cuenta"]);
  }

}
