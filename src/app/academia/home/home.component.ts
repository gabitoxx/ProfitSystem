import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/interfaces/IUser';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


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
