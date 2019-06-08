import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/IUser';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  user:IUser = null;


  constructor(
      private router: Router,
      private userService: UsersService){
    
  }

  ngOnInit() {
    // XXX cambiar por user logueado
    var userId = 'U_1558737773138';
    this.userService.getUserById(userId).valueChanges().subscribe(
        (userFirebase: IUser) => {
          this.user = userFirebase; console.log("XXX.2 userFirebase:" , userFirebase);
        }
    );
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
