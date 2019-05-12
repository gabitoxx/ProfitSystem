import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { IAccount } from '../interfaces/IAccount';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(public afDB: AngularFireDatabase){
  }

  /**
   * Devuelve todos
   * @returns un Observable // usar
   * .valueChanges().subscribe( ( data: IAccount[] ) => {}, (error) => {} );
   */
  public getAccounts(){
    return this.afDB.list('/accounts/');
  }
  
  /**
   * Devuelve uno por ID
   * @param id 
   * @returns un Observable // usar .valueChanges().subscribe( (data: IAccount) => {} );
   */
  public getAccountById(id:string){
    return this.afDB.object('/accounts/' + id);
  }

  /**
   * Crear uno nuevo
   * @param account IAccount
   * @returns un Observable // usar .then( () => {}, (error) => {} ); 
   */
  public createAccount(account: IAccount){
    return this.afDB.database.ref('/accounts/' + account.id).set(account);
  }

  /**
   * Editar 
   * @param account IAccount
   * @returns un Observable // usar .then( () => {}, (error) => {} );
   */
  public editAccount(account: IAccount){
    return this.afDB.database.ref('/accounts/' + account.id).set(account);
  }
  
  public deleteAccount(account: IAccount){
    return this.afDB.database.ref('/accounts/' + account.id).remove();
  }

}
