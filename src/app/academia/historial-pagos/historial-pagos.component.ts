import { Component, OnInit, Inject  } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { IPayment } from 'src/app/interfaces/IPayment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';

export interface IMG {
  id: string;
  url: string;
}


@Component({
  selector: 'app-historial-pagos',
  templateUrl: './historial-pagos.component.html',
  styleUrls: ['./historial-pagos.component.css']
})
export class HistorialPagosComponent implements OnInit {

  misPagos: IPayment[];
  
  constructor(
      private router: Router,
      private paymentService: PaymentService,
      public dialog: MatDialog){

    
    this.reloadPayments();

    window.setTimeout(() => { 
      this.reloadPayments();
    }, 4000);
    

  }

  ngOnInit() {
    
  }


  goHome(){
    this.router.navigate(["inversionistas/home"]);
  }

  /**
   * no funciona el async
   */
  async reloadPayments(){
    this.misPagos = await this.paymentService.getPagosDeUsuario('U_1558735692972'); // XXX cambiar por user logueado 
    console.log ( 'misPagos:', this.misPagos );
  }

  seePayment(id:string, url:string){

    const dialogRef = this.dialog.open(PaymentPictureModalDialog2, {
      width:  CONSTANTES_UTIL.MODAL_ANCHO_2,
      height: CONSTANTES_UTIL.MODAL_ALTO_2,
      data: {
        id: id,
        url: url
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}


@Component({
  selector: 'dialog-modal-see-image2',
  templateUrl: 'dialog-modal-see-image2.html',
})
export class PaymentPictureModalDialog2 {

  id: string = "";

  constructor(
      public dialogRef: MatDialogRef<PaymentPictureModalDialog2>,
      @Inject(MAT_DIALOG_DATA) public data: IMG){

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}