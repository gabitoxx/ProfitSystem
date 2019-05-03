import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-trading',
  templateUrl: './create-trading.component.html',
  styleUrls: ['./create-trading.component.css']
})
export class CreateTradingComponent implements OnInit {

  fecha: Date = null;
  fechaHoy: Date = null;

  account:string = "";
  available:number = 0.0;
  expense:number = 0.0;
  contrato:string = "";

  flagTrue: boolean = true;

  /* XXX */
  dummyIndex:number = 0;
  dummyData1:string[] = ['Cuenta A001 - descripcion 1', 'Cuenta A002 - descripcion 2', 'Cuenta A003 - descripcion 3'];
  dummyData2:number[] = [1000.0, 2000.0, 3000.0];

  constructor(private router: Router){
  }

  ngOnInit() {
    this.fecha = this.fechaHoy = new Date( Date.now() );
  }

  selectedContract(contract){
    console.log("contract:", contract);
    this.account   = this.dummyData1[ this.dummyIndex ];
    this.available = this.dummyData2[ this.dummyIndex ];
    this.dummyIndex++;
    if ( this.dummyIndex >= 3 ){
      this.dummyIndex = 0;
    }
  }

  newTrading(){
    alert('1. Crear Movimiento en la BD, 2.  Snackbar avisando creacion exitosa (podrá verse todos los tradings en la pág de consulta de Movimientos) y volver a pág de inicio');
    this.goHome();
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }
}
