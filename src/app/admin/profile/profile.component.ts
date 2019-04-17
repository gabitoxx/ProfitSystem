import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  /*
   * Datos del ADMINISTRADOR logueado
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
    this.nombre = "Admin";
    this.apellido = "Jimmy";
    this.email = "algo@profit.takers";
    this.direccion = "Kr. 99 Cll 123 - 56";
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
