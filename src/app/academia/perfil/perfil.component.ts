import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UsersService } from 'src/app/services/users.service';
import { IUser } from 'src/app/interfaces/IUser';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  /*
   * Datos del usuario logueado
   */
  user: IUser;

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
      private firebaseStorage: AngularFireStorage){

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
    console.log("XXX.1!")
    /** XXX id quemado */
    var userId = 'U_1556752233379';
    this.userService.getUserById(userId).valueChanges().subscribe(
        (userFirebase: IUser) => {
          this.user = userFirebase; console.log("XXX.2 userFirebase:" , userFirebase);
        }
    );
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

  goHome(){
    this.router.navigate(["academia/home"]);
  }

  updatePassword(){

    if ( this.passw == this.rep_passw ){
      alert("actualizar por Firebase_Auth ?")

    } else {
      this.snackBar.open(CONSTANTES_UTIL.ERROR_PASSWORDS_NO_COINCIDEN, 'X', this.configError);
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
  
  updateProfilePicture = () => {

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
    
    // aqui se debe buscar el User logueado y hacer un userService.editUser() 
    // XXX añadiendole antes: 
    //avatar = fileID           // avatarURL = imgURL
    console.log("imgURL: ", imgURL, "fileID:" , fileID);
    this.snackBar.open('Avatar cambiado', 'Ok', this.configSuccess);
  }

}
