import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(private router: Router){
    
  }

  ngOnInit() {
  }
  
  actualizarProfile(){
    this.router.navigate(["admin/profile"]);
  }

  createUser(){
    this.router.navigate(["admin/createUser"]);
  }

  createAccount(){
    this.router.navigate(["admin/createAccount"]);
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
