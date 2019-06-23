import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private angularFireAuth: AngularFireAuth){
    
  }

  /**
   * Usar .then( (data) => { ... }
    ).catch(
      (error) => {
        console.error('Ocurrió un error', error);
      }
    );
   * @param email 
   * @param password 
   */
  loginWithEmail(email: string, password: string) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
    //     esto regresa una Promesa, la retornaremos
  }

  /**
   * crear uno nuevo
   * Usar: .then( (data) => {...}).catch(
        (error) => {
        console.error('Ocurrió un error en el registro', error);
      });
   * @param email 
   * @param password 
   */
  registerWithEmail(email: string, password: string) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  /**
   * para saber el estatus actual
   */
  getStatus() {
    return this.angularFireAuth.authState;//regresa un Observable, tiene info sobre cada cambio que ocurra
  }

  /**
   * Propiedad: objeto Firebase User autenticado
   */
  currentUser(){
    // return firebase.auth().currentUser;
    return this.angularFireAuth.auth.currentUser;
  }

  /**
   * ENVÍO DE EMAIL para que establezca contraseña
   * 
   * Usar: .then(function() {
      // Password reset email sent. 
    }).catch(function(error) {
      // An error happened.
    });
   */
  sendPasswordResetEmail(email:string){
    return this.angularFireAuth.auth.sendPasswordResetEmail( email );
  }

  /**
   * 
   */
  logOut(){
    return this.angularFireAuth.auth.signOut();//regresa una promesa
  }
}
