import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private router: Router){
    
  }

  ngOnInit() {
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
    this.router.navigate(["login"]);
  }
}
