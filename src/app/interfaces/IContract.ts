import { IInvestor } from './IInvestor';

export interface IContract {
  id: string;
  nombre: string;
  estatusActivo: boolean;     // TRUE activo; FALSE cuenta inactiva
  fechaCreacion: string;      // DD/MM/YYYY
  cuentaId: string;           // solo puede apuntar a una cuenta
  diaCorteMes: number;        // de 1 a 31
  porcentaje: number;         // Porcentaje Rentabilidad pactado mensual
  constanteDeuda: number;     // $ Constante que debe descontarse todos los dias para los Clientes
  capital: number;            // Acumulado del Contrato DIFERENTE de la Cuenta

  responsableId: string;      //  1 userId -> el Contrato solo puede tener UN Responsable 

  inversionistasIds: IInvestor[]; // +1 userId -> los inversores
}