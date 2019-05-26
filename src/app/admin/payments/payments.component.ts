import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatSnackBarConfig, MatSlideToggleChange } from '@angular/material';
import { PaymentService } from 'src/app/services/payment.service';
import { IPayment } from 'src/app/interfaces/IPayment';
import { UsersService } from 'src/app/services/users.service';
import { IUser } from 'src/app/interfaces/IUser';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';

export interface PeriodicElement {
  id: number;
  fecha: string;
  name: string;
  link: string;
  monto: number;
  u1: number;u2: number; // XXX
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, fecha: '01/31/2021', name: 'Pepito PErez',link: 'link', monto: 123, u1: 1, u2: 2},
  {id: 2, fecha: '01/15/2021', name: 'Gab Sanchez', link: 'link', monto: 456, u1: 1, u2: 2},
  {id: 3, fecha: '12/31/2021', name: 'Darth Vader', link: 'link', monto: 789, u1: 1, u2: 2},
  {id: 4, fecha: '12/24/2021', name: 'Harry Potter',link: 'link', monto: 123000, u1: 1, u2: 2},
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
  displayedColumns: string[] = ['fecha', 'name', 'monto', 'link', 'u1', 'u2'];
  dataSource = []; //ELEMENT_DATA;

  // Arreglos
  pagos: IPayment[] = [];
  users: IUser[] = [];

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;


  constructor(
      private router: Router,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private paymentService: PaymentService,
      private userService: UsersService){

    this.configError = {
      panelClass: ['snackbar-accion-failure'],
      duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
    };
    
    this.configSuccess = {
      panelClass: ['snackbar-accion-succes'],
      duration: CONSTANTES_UTIL.SNACKBAR_DURATION_SUCCESS,
    };

  }


  ngOnInit() {

    this.from = this.until = new Date( Date.now() );

    // pagos 
    this.paymentService.getPayments().valueChanges().subscribe( 
        (pFirebase: IPayment[]) => {
          this.pagos = pFirebase.reverse(); //invierte el orden
          console.log("ngOnInit() - pagos desde Firebase", this.pagos);

          this.dataSource = this.pagos;

        }, (error) => {
          console.error("ngOnInit() - NO cargó pagos desde Firebase", error);
        }
    );

    // personas
    this.getUsers();
  }


  goHome(){
    this.router.navigate(["admin/home"]);
  }
  

  getUsers() {
    this.userService.getUsers().valueChanges().subscribe(
      ( data: IUser[] ) => {
        this.users = data;
        
      }, (error) => {
        console.error('CreateContractComponent.getUsers() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }

  getUserName(userId:string){
    var result = userId;
    var i:number; 
    var u:IUser;
    for ( i = 0; i < this.users.length; i++ ){
      u = this.users[i];
      if ( u.id == userId ){
        result = u.nombres + " " + u.apellidos;
        break;
      }
    }
    return result;
  }


  /**
   * Levantar el modal
   * @param id id del pago
   * @param idFile id del archivo/foto
   * @param fileName URL de la foto
   * @param concepto 
   * @param banco 
   * @param currency 
   * @param monto 
   * @param idUser ID del usuario
   */
  seePayment(id:string, idFile:string, fileName:string, concepto:string, banco:string, currency:string, monto:number, idUser:string){

    const dialogRef = this.dialog.open(PaymentPictureModalDialog, {
      width: MODAL_ANCHO,
      height: MODAL_ALTO,
      data: {
        id: id,
        idFile: idFile,
        URL: fileName,
        concepto: concepto,
        banco: banco,
        currency: currency,
        monto: monto,
        userId: idUser
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      const id = result;
    });
  }


  /**
   * 
   */
  toogleConfirmar = (pagoId:string, event:MatSlideToggleChange) => {
    console.log("procedo a " + event.checked + " al paGoID:" + pagoId);
    var i:number;
    var p:IPayment;

    ubicarPago:
    for ( i = 0; i < this.pagos.length; i++ ){
      if ( this.pagos[i].id == pagoId ){
        p = this.pagos[i];
        break;
      }
    }
    
    // setear cambio
    p.aprobado = event.checked;

    // salvar en firebase
    this.paymentService.editPayment( p ).then(
        () => {
          console.log('PaymentsComponent.toogleConfirmar() - OK');

          // actualizar usuario
          this.updateAvailablePersona( p );

        }, (error) => {
          console.error('PaymentsComponent.toogleConfirmar() - error:', error);
          this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
        }
    );
  }


  /**
   * Aumentar o disminuir en Firebase el saldo disponible de esta persona
   * @param pago 
   */
  updateAvailablePersona(pago: IPayment) {
    var usuario:IUser;
    ubicarPersona:
    for ( var i = 0; i < this.users.length; i++ ){
      if ( this.users[i].id == pago.idUser ){
        usuario = this.users[i];
        break;
      }
    }

    // si se Confirmó o no
    var seSuma = ( pago.aprobado ) ? true : false;

    // actualizar IUser.disponible
    var moneda = pago.currency;
    if ( moneda == CONSTANTES_UTIL.CURRENCY_DOLAR ){
      usuario.saldoDisponibleUSD = ( seSuma )
          ? usuario.saldoDisponibleUSD + pago.monto
          : usuario.saldoDisponibleUSD - pago.monto;

    } else if ( moneda == CONSTANTES_UTIL.CURRENCY_EURO ){
      usuario.saldoDisponibleEUR = ( seSuma )
          ? usuario.saldoDisponibleEUR + pago.monto
          : usuario.saldoDisponibleEUR - pago.monto;

    } else if ( moneda == CONSTANTES_UTIL.CURRENCY_PESO_CO ){
      usuario.saldoDisponibleCOP = ( seSuma )
          ? usuario.saldoDisponibleCOP + pago.monto
          : usuario.saldoDisponibleCOP - pago.monto;
    }
  
    // actualizar usuario
    this.userService.editUser( usuario ).then(
        () => {
          const msg = pago.aprobado 
              ? 'Pago Confirmado: '
              : 'Pago pendiente por confirmar: ';
          this.snackBar.open(msg + CONSTANTES_UTIL.SUCCESS_CAMBIOS_GUARDADOS, 'Ok', this.configSuccess);

          var op = ( seSuma ) ? 'sumó' : 'restó';
          console.log("updateAvailablePersona() - Se " + op 
              + " " + moneda + pago.monto + " al usuario " + usuario.id, usuario);

        }, (error) => {
          console.error("updateAvailablePersona() - ERROR -> ", error, 'Usuario quedó así:', usuario);
        }
    );

  }

  filtrar = () => {
    alert("TODO: pendiente programar para la fase 2");
  }

  excel(){
    alert("TODO: pendiente programar para la fase 2");
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