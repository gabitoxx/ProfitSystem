import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';

@Component({
  selector: 'app-toolbar-admin',
  templateUrl: './toolbar-admin.component.html',
  styleUrls: ['./toolbar-admin.component.css'],
  providers: [SessionService],
})
export class ToolbarAdminComponent implements OnInit {

  constructor(
      private router: Router,
      private authService: AuthService,
      private session: SessionService){
    
  }

  ngOnInit() {
  }

  actualizarProfile(){
    this.router.navigate(["admin/profile"]);
  }
  
  goHome(){
    this.router.navigate(["admin/home"]);
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

  createUser(){
    this.router.navigate(["admin/createUser"]);
  }

  seeUser(){
    this.router.navigate(["admin/users"]);
  }
  
  createAccount(){
    this.router.navigate(["admin/createAccount"]);
  }
  
  seeAccounts(){
    this.router.navigate(["admin/accounts"]);
  }

  createTrading(){
    this.router.navigate(["admin/createTrading"]);
  }
  
  seeTradings(){
    this.router.navigate(["admin/tradings"]);
  }
  
  createContract(){
    this.router.navigate(["admin/createContract"]);
  }

  seeContracts(){
    this.router.navigate(["admin/contracts"]);
  }

  payments(){
    this.router.navigate(["admin/payments"]);
  }
  
  reporteUser(){
    this.router.navigate(["admin/reportes/persona"]);
  }
  
  reporteTradings(){
    this.router.navigate(["admin/reportes/movimientos"]);
  }
}