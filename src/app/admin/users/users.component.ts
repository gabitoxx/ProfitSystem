import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/IUser';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { MatSnackBar, MatSnackBarConfig, MatDialog, MatSlideToggleChange } from '@angular/material';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  
  STATUS_ACTIVO:string   = CONSTANTES_UTIL.USUARIO_ACTIVO;
  STATUS_INACTIVO:string = CONSTANTES_UTIL.USUARIO_INACTIVO;

  INV:string = CONSTANTES_UTIL.ROL_INVERSIONISTA;
  ADM:string = CONSTANTES_UTIL.ROL_ADMIN;
  EST:string = CONSTANTES_UTIL.ROL_ACADEMIA;

  arrayUsers: IUser[];

  configError: MatSnackBarConfig;

  configSuccess: MatSnackBarConfig;
  
  /** Flags */
  iInvInactivos: number = 0;
  iInvActivos: number = 0;
  iEstInactivos: number = 0;
  iEstActivos: number = 0;
  iAdmins: number = 0;

  constructor(
      private router: Router,
      private userService: UsersService,
      private snackBar: MatSnackBar,
      public dialog: MatDialog){

    //datos remotos - Observable
    this.reloadTables();

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
  }

  
  /**
   * 
   * @param userId 
   * @param accion {activate, }
   * @param entity {Inversionista, }
   */
  toogleActivation(userId:string, accion:string, entity:string, ob: MatSlideToggleChange){
    
    console.log("Procedo a " + accion + " al user " + userId);
    /*
    if ( entity == this.ADM ){

      this.openConfirmDialog(userId);

    }
    */
    if ( accion == 'activate' ){

      this.userService.getUserById(userId).valueChanges().subscribe(
          (userFirebase: IUser) => {
            //
            userFirebase.status = CONSTANTES_UTIL.USUARIO_ACTIVO;

            this.userService.editUser(userFirebase).then(
                (success) => {
                  this.snackBar.open(entity + ": " + CONSTANTES_UTIL.SUCCESS_USER_ACTIVATED, 'Ok', this.configSuccess);
                  this.reloadTables();
                
                }).catch(
                  (error) => {
                    this.snackBar.open(CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'Ok', this.configError);
                    console.error(error);
                  }
                );
          }
      );
    } else if ( accion == 'deactivate' ){

      this.userService.getUserById(userId).valueChanges().subscribe(
          (userFirebase: IUser) => {
            //
            userFirebase.status = CONSTANTES_UTIL.USUARIO_INACTIVO;

            this.userService.editUser(userFirebase).then(
                (success) => {
                  this.snackBar.open(entity + ": " + CONSTANTES_UTIL.SUCCESS_USER_DEACTIVATED, 'Ok', this.configSuccess);
                  this.reloadTables();

                }).catch(
                  (error) => {
                    this.snackBar.open(CONSTANTES_UTIL.ERROR_CAMBIOS_NO_GUARDADOS, 'Ok', this.configError);
                    console.error(error);
                  }
                );
            }
        );
      }
  }

  reloadTables() {
    this.userService.getUsers().valueChanges().subscribe(
      ( data: IUser[] ) => {

        // mostrar u ocultar los paneles que dicen que no hay
        this.loopingUsersFlags(data);
        
        //data remota
        this.arrayUsers = data;
        
      }, (error) => {
        console.error('UsersComponent.reloadTables() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }

  /**
   * NO SE USA .forEach() porque no se tiene acceso a las variables de esta clase
   */
  loopingUsersFlags(data: IUser[]) {

    this.iInvInactivos = 0;
    this.iInvActivos = 0;
    this.iEstInactivos = 0;
    this.iEstActivos = 0;
    this.iAdmins = 0;

    var i:number;
    for ( i = 0; i < data.length; i++ ){
      
      var status = data[i].status;
      var rol    = data[i].rol;
      if ( status == 'INACTIVO' && rol == 'Inversionista' ){        this.iInvInactivos++;
      } else if ( status == 'ACTIVO' && rol == 'Inversionista' ){   this.iInvActivos++;
      } else if ( status == 'INACTIVO' && rol == 'Estudiante' ){    this.iEstInactivos++;
      } else if ( status == 'ACTIVO' && rol == 'Estudiante' ){      this.iEstActivos++;
      } else if ( rol == this.ADM ){                                this.iAdmins++;
      }
    }
  }


  reloadInvAct = () =>{

  }

  openConfirmDialog(adminId:string): void {
    const dialogRef = this.dialog.open( ConfirmationDialogComponent, {
      width: '350px',
      data: "¿Desea hacer el cambio sobre este Administrador?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log('Yes clicked', adminId);
        // DO SOMETHING
      }
    });
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }
}
