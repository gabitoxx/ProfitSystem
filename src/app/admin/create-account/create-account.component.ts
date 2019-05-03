import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CreateAccountComponent implements OnInit {

  nombre:string = "";
  info:string = "";
  money:number = 0.0;

  constructor(private router: Router){
  }

  ngOnInit() {
  }

  createNewAccount(){
    alert('1. Crear Cuenta en la BD, 2.  Snackbar avisando creacion exitosa (podrá verse todAs lAs cuentas en la pág de consulta de Cuentas) y volver a pág de inicio');
    this.goHome();
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }
}
