import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ITrading } from '../interfaces/ITrading';

@Injectable({
  providedIn: 'root'
})
export class TradingService {

  constructor(public afDB: AngularFireDatabase){
  }

  /**
   * Devuelve todos
   * @returns un Observable // usar
   * .valueChanges().subscribe( ( data: ITrading[] ) => {}, (error) => {} );
   */
  public getTradings(){
    return this.afDB.list('/tradings/');
  }
  
  /**
   * Devuelve uno por ID
   * @param id 
   * @returns un Observable // usar .valueChanges().subscribe( (firebase: ITrading) => {} );
   */
  public getTradingById(id:string){
    return this.afDB.object('/tradings/' + id);
  }

  /**
   * Crear uno nuevo
   * @param movimiento ITrading
   * @returns un Observable // usar .then( () => {}, (error) => {} );
   */
  public createTrading(movimiento: ITrading){
    return this.afDB.database.ref('/tradings/' + movimiento.id).set(movimiento);
  }

  /**
   * Editar 
   * @param movimiento ITrading
   * @returns un Observable // usar .then( () => {}, (error) => {} );
   */
  public editTrading(movimiento: ITrading){
    return this.afDB.database.ref('/tradings/' + movimiento.id).set(movimiento);
  }

  public deleteTrading(movimiento: ITrading){
    return this.afDB.database.ref('/tradings/' + movimiento.id).remove();
  }

  /**
   * Llamarlo desde una funcion async
   * La variable que reciba este arreglo debe esperar a que termine: await
   * @param userId 
   */
  public async getMovimientosDeAdmin(adminId:string){

    var movs: ITrading[] = [];

    await this.afDB.database
        .ref('/tradings/')
        .orderByChild("adminId")
        .equalTo(adminId)
        .on("child_added", function(snapshot) {
          //console.log(snapshot.key + " was " + snapshot.val().idUser + " m tall");
          movs.push( snapshot.val() );
        }
    );
    console.log("devolviendo en getMovimientosDeAdmin() -> " + movs.length +" movs:");
    return movs;
  }
}