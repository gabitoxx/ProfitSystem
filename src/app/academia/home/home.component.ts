import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router){

  }

  ngOnInit() {
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
