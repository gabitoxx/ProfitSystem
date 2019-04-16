import { Component, OnInit } from '@angular/core';
import { LoginValidacion } from './login.validate';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends LoginValidacion implements OnInit {
  
  public username: string;
  public password: string;

  constructor(private router: Router) {
    super();
  }

  ngOnInit() {
    this.getGroupValidator();
  }
  
  login() : void {
    if(this.username == 'admin' && this.password == 'admin'){
     this.router.navigate(["user"]);
    }else {
      alert("Invalid credentials");
    }
  }
}
