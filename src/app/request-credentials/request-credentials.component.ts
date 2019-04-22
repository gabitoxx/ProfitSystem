import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-credentials',
  templateUrl: './request-credentials.component.html',
  styleUrls: ['./request-credentials.component.css']
})
export class RequestCredentialsComponent implements OnInit {

  constructor(private router: Router){
    
  }

  ngOnInit() {
  }

  goLogin(){
    this.router.navigate(["login"]);
  }

  solicitarCuenta(){
    alert("1. Crear prospecto - 2. Enviar email a algun Admin para que apruebe la cuenta - 3. notificar a usuario por Snackbar e ir atrás");
    this.router.navigate(["login"]);
  }
}
