import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/IUser';
import { UsersService } from 'src/app/services/users.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [SessionService],
})
export class HomeComponent implements OnInit {


  user:IUser = null;

  
  constructor(
      private router: Router,
      private userService: UsersService,
      private session: SessionService){

  }

  ngOnInit() {
    
    if ( this.session.onExistItem(CONSTANTES_UTIL.key) ){
      this.user = this.session.onGetItemJSON(CONSTANTES_UTIL.key);

    } else {
      this.user = null;
      /**
       * PRUEBAS SIN LOGUEO cambiar por user logueado
       * user = {id: 'U_1558737773138'}; XXX
      this.userService.getUserById(user.id).valueChanges().subscribe(
            (userFirebase: IUser) => {
              this.user = userFirebase; console.log("userFirebase:" , userFirebase);
            }
          );
       */
      alert("Su sesión ha expirado - Por favor realizar LOGIN de nuevo");
      this.router.navigate(['login']);
    }
    
    
  }

  actualizarPerfil(){
    this.router.navigate(["inversionistas/perfil"]);
  }
  
  nuevoPago(){
    this.router.navigate(["inversionistas/pago/registrar"]);
  }

  pagos(){
    this.router.navigate(["inversionistas/historial/pagos"]);
  }
}
