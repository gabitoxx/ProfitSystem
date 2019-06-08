import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { IPayment } from '../interfaces/IPayment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(public afDB: AngularFireDatabase){
  }

  /**
   * Devuelve todos
   * @returns un Observable // usar
   * .valueChanges().subscribe( ( data: IPayment[] ) => {}, (error) => {} );
   */
  public getPayments(){
    return this.afDB.list('/payments/');
  }
  
  /**
   * Devuelve uno por ID
   * @param id 
   * @returns un Observable // usar .valueChanges().subscribe( (firebase: IPayment) => {} );
   */
  public getPaymentById(id:string){
    return this.afDB.object('/payments/' + id);
  }

  /**
   * Crear uno nuevo
   * @param pago IPayment
   * @returns un Observable // usar .then( () => {}, (error) => {} ); 
   */
  public createPayment(pago: IPayment){
    return this.afDB.database.ref('/payments/' + pago.id).set(pago);
  }

  /**
   * Editar 
   * @param pago IPayment
   * @returns un Observable // usar .then( () => {}, (error) => {} );
   */
  public editPayment(pago: IPayment){
    return this.afDB.database.ref('/payments/' + pago.id).set(pago);
  }
  
  public deletePayment(pago: IPayment){
    return this.afDB.database.ref('/payments/' + pago.id).remove();
  }

  public getXXX(userId:string){
    return this.afDB.database.ref('/payments/').orderByKey().on("value", function(snapshot) {
         console.log(snapshot.key);
       });
  }

  /**
   * Llamarlo desde una funcion async
   * La variable que reciba este arreglo debe esperar a que termine: await
   * @param userId 
   */
  public async getPagosDeUsuario(userId:string){

    var pagos: IPayment[] = [];

    await this.afDB.database
        .ref('/payments/')
        .orderByChild("idUser")
        .equalTo(userId)
        .on("child_added", function(snapshot) {
          //console.log(snapshot.key + " was " + snapshot.val().idUser + " m tall");
          console.log("adding to [] getPagosDeUsuario(" + userId + ")",  snapshot.val());
          pagos.push( snapshot.val() );
        }
    );
    console.log("devolviendo " + pagos.length +" pagos:", pagos);
    return pagos;
  }
}
