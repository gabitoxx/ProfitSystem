import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { IContract } from '../interfaces/IContract';
import { IInvestor } from '../interfaces/IInvestor';

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

  /**
   * Llamarlo desde una funcion async
   * La variable que reciba este arreglo debe esperar a que termine: await
   * @param userId 
   */
  public async getInversionistasDeContratos(userId:string){

    var contracts: IContract[] = [];
    var invs: IInvestor[] = [];

    await this.afDB.database
        .ref('/contracts/')
        .orderByChild("inversionistaId").equalTo(userId)
        //NO: .orderByValue().equalTo("inversionistas")
        //NO: .orderByChild("inversionistas").orderByChild("inversionistaId")
        .on("child_added", function(snapshot) {
          //console.log(snapshot.key + " was " + snapshot.val().idUser + " m tall");
          console.log("x3. adding to invs[]",  snapshot.val());
          invs.push( snapshot.val() );
        }
    );
    console.log("x3. devolviendo " + invs.length +" invs[]:", invs);
    return invs;
  }
}
