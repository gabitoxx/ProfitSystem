import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { IContract } from '../interfaces/IContract';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(public afDB: AngularFireDatabase){
  }

  /**
   * Devuelve todos
   * @returns un Observable // usar
   * .valueChanges().subscribe( ( data: IContract[] ) => {}, (error) => {} );
   */
  public getContracts(){
    return this.afDB.list('/contracts/');
  }
  
  /**
   * Devuelve uno por ID
   * @param id 
   * @returns un Observable // usar .valueChanges().subscribe( (firebase: IContract) => {} );
   */
  public getContractById(id:string){
    return this.afDB.object('/contracts/' + id);
  }

  /**
   * Crear uno nuevo
   * @param contract Icontract
   * @returns un Observable // usar .then( () => {}, (error) => {} ); 
   */
  public createContract(contract: IContract){
    return this.afDB.database.ref('/contracts/' + contract.id).set(contract);
  }

  /**
   * Editar 
   * @param contract Icontract
   * @returns un Observable // usar .then( () => {}, (error) => {} );
   */
  public editContract(contract: IContract){
    return this.afDB.database.ref('/contracts/' + contract.id).set(contract);
  }
  
  public deleteContract(contract: IContract){
    return this.afDB.database.ref('/contracts/' + contract.id).remove();
  }
}
