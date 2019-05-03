import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface PeriodicElement {
  id: number;
  name: string;
  porc_diario: number;
  porcentaje: number;
  responsable: string;
  delete: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, porc_diario: 0.7, name: 'Pepito PErez', porcentaje: 20, responsable: 'No', delete: 'X'},
  {id: 2, porc_diario: 0.4, name: 'Gab Sanchez', porcentaje: 15, responsable: 'No', delete: 'X'},
  {id: 3, porc_diario: 0.3, name: 'Darth Vader', porcentaje: 10, responsable: 'Sí', delete: 'X'},
  {id: 4, porc_diario: 0.1, name: 'Harry Potter', porcentaje: 5, responsable: 'No', delete: 'X'},
];

export interface DialogData {
  animal: string;
  name: string;
}

const MODAL_ANCHO:string = '550px';
const MODAL_ALTO:string = '400px';

@Component({
  selector: 'app-create-contract',
  templateUrl: './create-contract.component.html',
  styleUrls: ['./create-contract.component.css']
})
export class CreateContractComponent implements OnInit {

  account: string = "";
  currency: string = "";
  available: number = 0.0;
  /* XXX */
  dummyIndex:number = 0;
  dummyData1:string[] = ['USD ($)', 'EUR (€)', 'COP ($)'];
  dummyData2:number[] = [1000.0, 2000.0, 3000.0];

  expense: number = 30;

  /* XXX */
  displayedColumns: string[] = ['name', /*'porcentaje', 'porc_diario',*/ 'responsable', 'delete'];
  dataSource = ELEMENT_DATA;

  // Dialog - modal data
  animal: string;
  name: string;
  inv_person: string;
  inv_prpm: number;
  email: string;


  constructor(
      private router: Router,
      public dialog: MatDialog){
  }

  ngOnInit() {
    
  }

  selectedAccount(cuenta: any){
    console.log("cuenta:", cuenta);
    this.currency   = this.dummyData1[ this.dummyIndex ];
    this.available = this.dummyData2[ this.dummyIndex ];
    this.dummyIndex++;
    if ( this.dummyIndex >= 3 ){
      this.dummyIndex = 0;
    }
  }

  newContract(){
    alert('1. Crear Contrato en la BD, 2. ver si se puede enviar email con creacion de contrato para registros 3.  Snackbar avisando creacion exitosa (podrá verse todAs lAs cuentas en la pág de consulta de Cuentas) y volver a pág de inicio');
    this.goHome();
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }

  deleteInvestor(id:number){
    alert('Eliminar este: ' + id);
  }

  addInvestor() {
    this.name = 'avengers@domin.io';
    this.animal = '321 132 4567';

    const dialogRef = this.dialog.open(AddInvestorModalDialog, {
      width: MODAL_ANCHO,
      height: MODAL_ALTO,
      data: {
        name: this.name,
        animal: this.animal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }


}

@Component({
  selector: 'dialog-modal-add-investor',
  templateUrl: 'dialog-modal-add-investor.html',
})
export class AddInvestorModalDialog {

  name2: string   = "";
  animal2: string = "";

  /* XXX */
  dummyIndex2:number = 0;
  dummyData3:string[] = ['avengers@domin.io', 'ragnarok@domin.io', 'endgame@domin.com'];
  dummyData4:string[] = ['3001234567', '301 - 132.4657', '320 - 9876543'];
/*
  inv_person
  inv_prpm
  investor
*/

  constructor(
    public dialogRef: MatDialogRef<AddInvestorModalDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedInvestor(investor){
    console.log("investor:", investor);
    this.name2   = this.dummyData3[ this.dummyIndex2 ];
    this.animal2 = this.dummyData4[ this.dummyIndex2 ];
    this.dummyIndex2++;
    if ( this.dummyIndex2 >= 3 ){
      this.dummyIndex2 = 0;
    }
  }

}