import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  /*
   * Datos del usuario logueado
   */
  nombre:string = "";
  apellido:string = "";
  email:string = "";
  ciudad:string = "";
  direccion:string = "";
  telefono:string = "";
  info:string = "";
  //
  passw:string = "";
  rep_passw:string = "";
  tooglePassw:boolean = false;
  
  /*
   * {'lock', 'lock_open'}
   */
  iconPassw: string = "lock";
  /*
   * {'text', 'password'}
   */
  typePassw: string = "password";

  constructor(private element: ElementRef){
    
  }

  ngOnInit() {
    this.nombre = "Pepito";
    this.apellido = "Peérez";
    this.email = "algo@domin.io";
    this.direccion = "Kr. 28 Cll 123 - 56";
    this.telefono = "3001234567";
  }

  /**
   * 
   */
  updatePerfil(){

  }

  tooglePassword(){
    this.tooglePassw = !this.tooglePassw;
    this.iconPassw = ( this.tooglePassw == true ) ? 'lock_open' : 'lock';
    this.typePassw = ( this.tooglePassw == true ) ? 'text'      : 'password';
  }

}
