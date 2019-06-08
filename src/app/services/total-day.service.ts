import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ITotalDia } from '../interfaces/ITotalDia';
import { ValidatorUtils } from '../shared/_utils/validator-utils';
import { CONSTANTES_UTIL } from '../shared/_utils/constantes-util';

@Injectable({
  providedIn: 'root'
})
export class TotalDayService {

  constructor(public afDB: AngularFireDatabase){
  }

  /**
   * Devuelve todos
   * @returns un Observable // usar
   * .valueChanges().subscribe( ( data: ITotalDia[] ) => {}, (error) => {} );
   */
  public getAcumDays(){
    return this.afDB.list('/acumulados/');
  }
  
  /**
   * Devuelve uno por ID
   * @param id 
   * @returns un Observable // usar .valueChanges().subscribe( (firebase: ITotalDia) => {} );
   */
  public getAcumDayById(id:string){
    return this.afDB.object('/acumulados/' + id);
  }

  /**
   * Devuelve uno por ID
   * @param fecha:Date
   * @returns un Observable // usar .valueChanges().subscribe( (firebase: ITotalDia) => {} );
   */
  public getAcumDayByDate(fecha: Date){
    
    const f = CONSTANTES_UTIL.PREFFIX_DAY + ValidatorUtils.getFechaFormato2Date( fecha );

    return this.afDB.object('/acumulados/' + f);
  }

  /**
   * Devuelve acumulado DE HOY
   * @returns un Observable // usar .valueChanges().subscribe( (firebase: ITotalDia) => {} );
   */
  public getAcumuladoHoy(){

    const f = CONSTANTES_UTIL.PREFFIX_DAY + ValidatorUtils.getFechaFormato2();

    return this.afDB.object('/acumulados/' + f);
  }

  /**
   * Crear uno nuevo
   * @param totalDia ITotalDia
   * @returns un Observable // usar .then( () => {}, (error) => {} ); 
   */
  public createAcumDay(totalDia: ITotalDia){
    return this.afDB.database.ref('/acumulados/' + totalDia.id).set(totalDia);
  }

  /**
   * Editar 
   * @param totalDia ITotalDia
   * @returns un Observable // usar .then( () => {}, (error) => {} );
   */
  public editAcumDay(totalDia: ITotalDia){
    return this.afDB.database.ref('/acumulados/' + totalDia.id).set(totalDia);
  }

  public deleteAcumDay(totalDia: ITotalDia){
    return this.afDB.database.ref('/acumulados/' + totalDia.id).remove();
  }
}
