import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface PeriodicElement {
  id: number;
  fecha: string;
  name: string;
  link: string;
  monto: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, fecha: '01/31/2021', name: 'Pepito PErez',link: 'link', monto: 123},
  {id: 2, fecha: '01/15/2021', name: 'Gab Sanchez', link: 'link', monto: 456},
  {id: 3, fecha: '12/31/2021', name: 'Darth Vader', link: 'link', monto: 789},
  {id: 4, fecha: '12/24/2021', name: 'Harry Potter',link: 'link', monto: 123000},
];


const MODAL_ANCHO:string = '850px';
const MODAL_ALTO:string = '650px';

export interface DialogModalData {
  id: string;
  linkURL: string;
}

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  from: Date = null;
  until: Date = null;

  /* XXX */
  displayedColumns: string[] = ['fecha', 'name', 'monto', 'link'];
  dataSource = ELEMENT_DATA;

  id: string;

  constructor(
    private router: Router,
    public dialog: MatDialog){
}

  ngOnInit() {
    this.from = this.until = new Date( Date.now() );
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }
  
  seePayment(){
    this.id = '321 132 4567';

    const dialogRef = this.dialog.open(PaymentPictureModalDialog, {
      width: MODAL_ANCHO,
      height: MODAL_ALTO,
      data: {
        id: this.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.id = result;
    });
  }
}



@Component({
  selector: 'dialog-modal-see-image',
  templateUrl: 'dialog-modal-see-image.html',
})
export class PaymentPictureModalDialog {

  id: string = "";

  constructor(
      public dialogRef: MatDialogRef<PaymentPictureModalDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogModalData){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}