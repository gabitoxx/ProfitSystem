import { IInvestor } from './IInvestor';

export interface IContract {
  id: string;
  nombre: string;
  estatusActivo: boolean;     // TRUE activo; FALSE contrato inactivo
  
  fechaCreacion: string;         // DD/MM/YYYY
  fechaCreacionMillisecs: number // Milliseconds

  cuentaId: string;           // solo puede apuntar a una cuenta
  diaCorteMes: number;        // de 1 a 31
  porcentaje: number;         // Porcentaje Rentabilidad pactado mensual
  responsableId: string;      //  1 userId -> el Contrato solo puede tener UN Responsable 

  /**
   * $ Constantes que debe descontarse todos los dias para los Clientes
   * 
   * OJO: se usa los Intereses diarios a nivel de Cuenta, no de contrato
   */
  constanteDeudaUSD: number;
  constanteDeudaEUR: number;
  constanteDeudaCOP: number;

  // Capital del Contrato DIFERENTE de la Cuenta: cuando se crea el contrato
  capitalContratoUSD: number;
  capitalContratoEUR: number;
  capitalContratoCOP: number;

  // +1 info de los inversores con la que entran al Contrato
  inversionistas: IInvestor[]; 
}