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
    this.router.navigate(["academia/perfil"]);
  }
  
  goHome(){
    this.router.navigate(["academia/home"]);
  }

  nuevoPago(){
    this.router.navigate(["academia/pago/registrar"]);
  }

  logout(){
    this.router.navigate(["login"]);
  }
}
