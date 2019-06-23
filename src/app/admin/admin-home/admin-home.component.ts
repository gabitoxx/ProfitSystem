import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/IUser';
import { UsersService } from 'src/app/services/users.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  providers: [SessionService],
})
export class AdminHomeComponent implements OnInit {

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
              this.user = userFirebase; console.log(" userFirebase:" , userFirebase);
            }
          );
       */
      alert("Su sesión ha expirado - Por favor realizar LOGIN de nuevo");
      this.router.navigate(['login']);
    }
  }
  
  actualizarProfile(){
    this.router.navigate(["admin/profile"]);
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
  
  createContract(){
    this.router.navigate(["admin/createContract"]);
  }

  seeContracts(){
    this.router.navigate(["admin/contracts"]);
  }

  payments(){
    this.router.navigate(["admin/payments"]);
  }

  seeTradings(){
    this.router.navigate(["admin/tradings"]);
  }

  reports = (menu:string) => {
    if ( menu == 'people' ){
      this.router.navigate(["admin/reportes/persona"]);

    } else if ( menu == 'tradings' ){
      this.router.navigate(["admin/reportes/movimientos"]);
    }
  }

}
