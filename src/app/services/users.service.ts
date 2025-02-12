import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CONSTANTES_UTIL } from '../shared/_utils/constantes-util';
import { IUser } from '../interfaces/IUser';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(public afDB: AngularFireDatabase){
  }

  /**
   * Devuelve todos
   * @returns un Observable // usar
   * .valueChanges().subscribe( ( data: IUser[] ) => {}, (error) => {} );
   */
  public getUsers(){
    return this.afDB.list('/users/');
  }
  
  /**
   * Devuelve uno por ID
   * @param id 
   * @returns un Observable // usar .valueChanges().subscribe( (userFirebase: IUser) => {} );
   */
  public getUserById(id:string){
    return this.afDB.object('/users/' + id);
  }

  /**
   * Crear uno nuevo
   * @param user IUser
   * @returns un Observable // usar .then( () => {}, (error) => {} ); 
   */
  public createUser(user: any){
    return this.afDB.database.ref('/users/' + user.id).set(user);
  }

  /**
   * Editar 
   * @param user IUser
   * @returns un Observable // usar .then( () => {}, (error) => {} );
   */
  public editUser(user: any){
    return this.afDB.database.ref('/users/' + user.id).set(user);
  }
  
  public deleteUser(user: any){
    return this.afDB.database.ref('/users/' + user.id).remove();
  }

  /**
   * solo para ACTIVAR
   * @param userID
   * @returns un Observable // usar .then( () => {}, (error) => {} );
   */
/*   public activateUser(id:string){
    return this.editStatus(id, true);
  } */

  /**
   * solo para DESACTIVAR
   * @param userID
   * @returns un Observable // usar .then( () => {}, (error) => {} );
   */
/*  public deactivateUser(id:string){
    return this.editStatus(id, false);
  }
*/
  /**
   * 
   * @param id 
   * @param activo  TRUE activo : FALSE otherwise
   * @returns un Observable // usar .then( () => {}, (error) => {} );
   */
  public activateUser(id:string){
    
      //let usuario:any = this.afDB.object('/users/' + id);
      this.getUserById(id).valueChanges().subscribe(
          (userFirebase: IUser) => {
            //
            userFirebase.status = CONSTANTES_UTIL.USUARIO_ACTIVO;

            // lo mismo que edit()
            return this.afDB.database.ref('/users/' + userFirebase.id).set(userFirebase);
          }
      );
    
  }


  /**
   * Devuelve los Usuarios por orden alfabetico: nombres
   * Llamarlo desde una funcion async
   * La variable que reciba este arreglo debe esperar a que termine: await
   */
  public async getUsersOrdered(){
    var array:IUser[] = [];

    var us = this.afDB.database.ref('/users/');
    us.orderByChild("nombres").on("child_added", function( data ){
      //console.log(data.val().name);
      array.push( data.val() );
   });

   return array;
  }

  /**
   * Llamarlo desde una funcion async
   * La variable que reciba este arreglo debe esperar a que termine: await
   * @param userId 
   */
  public async getUsuarioByEmail(email:string){

    var user: IUser = null;

    await this.afDB.database
        .ref('/users/')
        .orderByChild("email")
        .equalTo(email)
        /* .limitToFirst(1) */
        .on("child_added", function(snapshot) {
            user = snapshot.val();
          }
        );
    return user;
  }
}
