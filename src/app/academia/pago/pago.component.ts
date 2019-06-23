import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { IPayment } from 'src/app/interfaces/IPayment';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css'],
  providers: [SessionService],
})
export class PagoComponent implements OnInit {
  
  /** snackbar styles */
  configError:   MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;

  /** Formulario */
  banco: string = "";
  fecha:Date;
  fechaHoy:Date;
  monto:number;
  currency:string = "";
  concepto:string = "";
  destino:string = "";

  pago: IPayment = null;
  bProcesandoPago:boolean = false;

  /**
   * Imagen archivo firebase storage
   */
  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;


  /**
   * 
   * @param router 
   * @param snackBar 
   * @param paymentService 
   * @param firebaseStorage 
   */
  constructor(
      private router: Router,
      private snackBar: MatSnackBar,
      private paymentService: PaymentService,
      private firebaseStorage: AngularFireStorage,
      private session: SessionService){

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
    this.fecha = this.fechaHoy = new Date( Date.now() );
    this.monto = 0.0;
  }

  goHome(){
    this.router.navigate(["inversionistas/home"]);
  }


  updateProfilePicture(){}


  /**
   * Primero se procede a cargar imagen file upload al Firebase Storage
   * Luego invocará a this.crearPagoObj
   */
  crearPago = () => {
    
    // validar
    if ( !this.validarForm() ){
      return;

    } else if ( !this.session.onExistItem(CONSTANTES_UTIL.key) ){
      
      this.bProcesandoPago = false;

      let snackBarRef = this.snackBar.open(
        CONSTANTES_UTIL.ERROR_NO_SESSIONSTORAGEKEY,
        'Entendido', this.configSuccess
      );

      snackBarRef.onAction().subscribe(() => { this.router.navigate(['login']); });
      
      // 4 segundos
      window.setTimeout(() => { this.router.navigate(['login']); }, 4000);

    } else {
      this.bProcesandoPago = true;
    }

    // current date
    var hoyMillisecs = Date.now();

    // subir imagen
    var fileID = CONSTANTES_UTIL.PREFFIX_PAYMENT_IMAGE + hoyMillisecs;

    console.log('croppedImage==>', this.croppedImage);

    /**
     * Guardar en el nodo de STORAGE, se debe guardar con extensión de imagen
     */
    const refNodoFbStorageFile = CONSTANTES_UTIL.FIRESTORAGE_NODO_PAGOS + fileID + CONSTANTES_UTIL.EXTENSION_JPG;

    /**
     * el .ref() retorna una promesa
     */
    const pictures = this.firebaseStorage
        .ref( refNodoFbStorageFile )                   //referenciamos un nodo dentro de STORAGE
        .putString( this.croppedImage, 'data_url' );   //obtenemos imagen en formato binario
    
    /**/
    pictures.then(
        (result) => {
          this.picture = this.firebaseStorage
              .ref( refNodoFbStorageFile )      //referenciamos el objeto creado de base64
              .getDownloadURL();                //obtenemos su URL

          this.picture.subscribe( ( imgURL ) => {

              this.crearPagoObj(imgURL, hoyMillisecs, fileID);
          });
        }, (error) => {
          console.error("Firebase: NO se puede upload de IMAGEN de PAGO: ", error);
          this.snackBar.open("Subida de archivo: " + CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'Entendido', this.configError);
        }
    );
  }


  /**
   * Registrar nuevo pago en el sistema
   * Se crea el objeto en /payments
   * Despues de haber cargado la imagen del pantallazo
   * aprobado: false => solo el ADMIN lo podrá aprobar, deberá hacer verificación manual
   */
  crearPagoObj = (imgURL:string, hoyMillisecs:number, fileId:string) => {

    var user = this.session.onGetItemJSON(CONSTANTES_UTIL.key);
    
    // Formatear JSON
    this.pago = {
      id: CONSTANTES_UTIL.PREFFIX_PAYMENT + hoyMillisecs,
      idFile:        fileId,
      fileExtension: CONSTANTES_UTIL.EXTENSION_JPG,
      fileName: imgURL,
      banco:    this.banco,
      fecha:          ValidatorUtils.getFechaFormato1(),
      fechaMillisecs: hoyMillisecs,
      monto:    this.monto,        // aumenta el 'saldoDisponible' del usuario UNA VEZ que el Admin certifique el pago
      currency: this.currency,
      concepto: this.concepto,
      destino:  this.destino,
      idUser:   user.id,
      aprobado: false,  // solo el ADMIN lo podrá aprobar, deberá hacer verificación manual
    }
    
    console.log('this.pago ==>', this.pago);
    
    //servicio
    this.paymentService.createPayment(this.pago).then(
        () => {
          console.log('pago exitoso');
          this.bProcesandoPago = false;

          let snackBarRef = this.snackBar.open(
            'Pago registrado satisfactoriamente. Podrá ver sus pagos en la sección Historial"',
            'Entendido', this.configSuccess
          );

          snackBarRef.onAction().subscribe(() => { this.goHome(); });
          
          // 4 segundos
          window.setTimeout(() => { this.goHome(); }, 4000);
          
        }, (error) => {
          console.error("Firebase: NO se puede crear PAGO: ", error);
          this.snackBar.open("Registro de Pago fallido: " + CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'Entendido', this.configError);
        }
    );
  }


  validarForm() {

    if ( this.banco == null || this.banco == undefined || this.banco.trim() == '' ){
      this.snackBar.open('Especifique un Banco/Cuenta con su medio de pago', 'Ok', this.configError);
      return false;
    } else if ( this.fecha == null || this.fecha == undefined ){
      this.snackBar.open('Especifique la Fecha en la que realizó el giro.', 'Ok', this.configError);
      return false;
    } else if ( this.monto == null || this.monto == undefined || this.monto <= 0 ){
      this.snackBar.open('Indique el monto de su consignación (debe ser mayor a 0).', 'Ok', this.configError);
      return false;
    } else if ( this.currency == null || this.currency == undefined || this.currency.trim() == '' ){
      this.snackBar.open('Elija un tipo de Moneda ($ ó €).', 'Ok', this.configError);
      return false;
    } else if ( this.concepto == null || this.concepto == undefined || this.concepto.trim() == '' ){
      this.snackBar.open('Digite un concepto (detalle de nota u observaciones).', 'Ok', this.configError);
      return false;
    } else if ( this.destino == null || this.destino == undefined || this.destino.trim() == '' ){
      this.snackBar.open('Destino: Especifique en qué será usado su capital.', 'Ok', this.configError);
      return false;
    } else if ( this.croppedImage == '' ){
      this.snackBar.open('Debe cargar una captura de pantalla en formato ".png".', 'Buscaré un .PNG', this.configError);
      return false;
    }
    
    return true;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
    this.snackBar.open('Error al cargar la imagen. Asegúrese que solo sea un archivo en formato .PNG', 'Intentaré de nuevo', this.configError);
  }
  cropperReady() {
    // cropper ready
  }

}
