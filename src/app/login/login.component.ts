import { Component, OnInit } from '@angular/core';
import { LoginValidacion } from './login.validate';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends LoginValidacion implements OnInit {
  
  public email: string;
  public password: string;

  tooglePassw:boolean = false;
  /*
   * {'lock', 'lock_open'}
   */
  iconPassw: string = "lock";
  /*
   * {'text', 'password'}
   */
  typePassw: string = "password";


  constructor(private router: Router) {
    super();
  }

  ngOnInit() {
    this.getGroupValidator();
  }

  login() : void {
    if ( this.email == 'academia' && this.password == 'academia' ){
      this.router.navigate(["academia/home"]);

    } else if ( this.email == 'admin' && this.password == 'admin' ){
      this.router.navigate(["admin/home"]);

    } else {
      alert("Invalid credentials");
    }
  }

  tooglePassword(){
    this.tooglePassw = !this.tooglePassw;
    this.iconPassw = ( this.tooglePassw == true ) ? 'lock_open' : 'lock';
    this.typePassw = ( this.tooglePassw == true ) ? 'text'      : 'password';
  }

  applyForNewUseraccount(){
    this.router.navigate(["nueva/cuenta"]);
  }

}
