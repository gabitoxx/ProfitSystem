import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-admin',
  templateUrl: './toolbar-admin.component.html',
  styleUrls: ['./toolbar-admin.component.css']
})
export class ToolbarAdminComponent implements OnInit {

  constructor(private router: Router){
    
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
    this.router.navigate(["login"]);
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

  payments(){
    this.router.navigate(["admin/payments"]);
  }
}