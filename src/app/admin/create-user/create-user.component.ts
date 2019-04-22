import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  constructor(private router: Router){
    
  }

  ngOnInit() {
  }

  createNewUser(){
    alert('1. Crear usuario en la BD, 2. Ver si se puede notificar por email, 3. Snackbar avisando creacion exitosa (podrá verse todos los usuarios en la pág de consulta de usuarios) y volver a pág de inicio');
    this.goHome();
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }
}
