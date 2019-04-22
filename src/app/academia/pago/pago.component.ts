import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  constructor(private router: Router){
  }

  ngOnInit() {
  }

  goHome(){
    this.router.navigate(["academia/home"]);
  }
}
