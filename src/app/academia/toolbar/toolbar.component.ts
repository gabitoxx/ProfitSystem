import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  providers: [SessionService],
})
export class ToolbarComponent implements OnInit {

  displayName:string = '';


  constructor(
      private router: Router,
      private authService: AuthService,
      private session: SessionService){
    
  }

  ngOnInit() {
    if ( this.session.onExistItem(CONSTANTES_UTIL.key) ){
      let user = this.session.onGetItemJSON(CONSTANTES_UTIL.key);
      this.displayName = user.nombres + " " + user.apellidos;
    }
  }

  actualizarPerfil(){
    this.router.navigate(["inversionistas/perfil"]);
  }
  
  goHome(){
    this.router.navigate(["inversionistas/home"]);
  }

  nuevoPago(){
    this.router.navigate(["inversionistas/pago/registrar"]);
  }

  pagos(){
    this.router.navigate(["inversionistas/historial/pagos"]);
  }
  
  logout(){
    this.authService.logOut().then(
      () => {
        if ( this.session.onExistItem(CONSTANTES_UTIL.key) )
          this.session.onRemoveItem(CONSTANTES_UTIL.key);

        this.router.navigate(['login']);
      }
    ).catch( (error) => {
      console.error('cerrarSesion() - error', error);
      alert("Problemas con el Internet impidieron el cierre de sesión correcto. Si lo deseas intentalo de nuevo o cierra esta pestaña y borra la caché de tu navegador");
    });
  }
}
