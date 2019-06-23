import { Component, OnInit, ElementRef } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { IUser } from 'src/app/interfaces/IUser';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [SessionService],
})
export class ProfileComponent implements OnInit {

  /*
   * Datos del usuario logueado
   */
  user: IUser;
  currentEmail:string = '';

  //
  passw:string = "";
  rep_passw:string = "";
  tooglePassw:boolean = false;
  
  /*
   * {'lock', 'lock_open'}
   * {'visibility_off', 'visibility'}
   */
  iconPassw: string = "visibility_off";

  /*
   * {'text', 'password'}
   */
  typePassw: string = "password";

  /** snackbar styles */
  configError:   MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  
  /**
   * Imagen archivo firebase storage
   */
  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;
  

  constructor(
      private element: ElementRef,
      private router: Router,
      private userService: UsersService,
      private snackBar: MatSnackBar,
      private firebaseStorage: AngularFireStorage,
      private session: SessionService,
      private authService: AuthService){

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
    this.user = this.session.onGetItemJSON(CONSTANTES_UTIL.key);
    this.currentEmail = this.user.email;
  }


  goHome(){
    this.router.navigate(["admin/home"]);
  }

  
  /**
   * Actualiza el primer formulario
   */
  updatePerfil(){

    this.user.nombres   = ValidatorUtils.titleCase( this.user.nombres );
    this.user.apellidos = ValidatorUtils.titleCase( this.user.apellidos );
    this.user.ciudad    = ValidatorUtils.titleCase( this.user.ciudad );

    this.userService.editUser( this.user ).then(
        () => {
          this.snackBar.open(CONSTANTES_UTIL.SUCCESS_CAMBIOS_GUARDADOS, 'Ok', this.configSuccess);
        },
        (error) => {
          this.snackBar.open(CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'X', this.configError);
        }
    );
  }

  tooglePassword(){
    this.tooglePassw = !this.tooglePassw;
    this.iconPassw = ( this.tooglePassw == true ) ? 'visibility' : 'visibility_off';
    this.typePassw = ( this.tooglePassw == true ) ? 'text'       : 'password';
  }

  updatePassword(){

    var mail = this.currentEmail;

    var r = confirm("Se procederá a enviar un correo electrónico de parte del sistema de Profit Takers para el cambio de Contraseña... \n\n ¿Desea continuar?");
    if ( r ){
      if ( mail == null || mail == undefined || mail.trim() == '' ){
        this.snackBar.open("No es posible confirmar su correo (" + mail + ")",
            'Lo intentaré luego', this.configError);

      } else {
        console.log("Mail:" + mail);
        this.authService.sendPasswordResetEmail( mail )
            .then(function() {
              // Password reset email sent. 
              console.log("Password reset email sent.");
              //this.snackBar.open("Se envió correo requiriendo cambio de Password a la cuenta " + mail,
              //  'Ok', this.configSuccess);
              alert("Se envió correo requiriendo cambio de Password a la cuenta " + mail);

            }).catch( function(error) {
              //this.snackBar.open("No fue posible el envío de correo 'Password reset' a la cuenta: " + mail,
              //  'Lo intentaré luego', this.configError + 2000);
              alert("No fue posible el envío de correo 'Password reset' a la cuenta: " + mail);
              console.error(mail, error);
            });
      }
    }
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


  updateProfilePicture = () =>{

    if ( !this.croppedImage ){
      this.snackBar.open("Primero seleccione un archivo de imagen, luego redimenzione ajustando a su gusto y luego pulse 'Actualizar foto de perfil'",
        'Entendido', this.configError);
      return;
    }

    var hoyMillisecs = Date.now();
    var fileID = CONSTANTES_UTIL.PREFFIX_FOTO + hoyMillisecs;

    /**
     * Guardar en el nodo de STORAGE, se debe guardar con extensión de imagen
     */
    const refNodoFbStorageFile = CONSTANTES_UTIL.FIRESTORAGE_NODO_AVATAR + fileID + CONSTANTES_UTIL.EXTENSION_JPG;

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

            this.actualizarPerfilUsuario(imgURL, fileID);
        });

      }, (error) => {
        console.error("Firebase: NO se puede upload de IMAGEN de PAGO: ", error);
        this.snackBar.open("Subida de archivo: " + CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'Entendido', this.configError);
      }
    );
  }


  actualizarPerfilUsuario(imgURL: any, fileID: string) {
    
    this.user.avatar    = fileID;
    this.user.avatarURL = imgURL;

    this.userService.editUser( this.user ).then(
        () => {
          console.log("imgURL: ", imgURL, "fileID:" , fileID);
          this.snackBar.open('Avatar modificado exitosamente.', 'Ok', this.configSuccess);

          this.session.onSetItemJSON(CONSTANTES_UTIL.key, this.user);
          
          window.setTimeout(() => { this.goHome(); }, 3000);

        }, (error) => {
          console.error("PerfilComponent.actualizarPerfilUsuario() - imgURL: ", imgURL, "fileID:" , fileID, "error:", error);
          this.snackBar.open('Avatar no actualizado debido a error interno. Por favor intente más tarde.', 'Ok', this.configError);
        }
    );
  }

}
