export interface IAccount {

  id: string;             // CONSTANTES_UTIL.PREFFIX_ACCOUNT + Date in millisecs
  nombre: string;
  descripcion: string;
  
  gestorId: string        // CONSTANTES_UTIL.PREFFIX_USER + Date in millisecs  ( ADMINISTRADOR )
  estatusActivo: boolean; // TRUE activo; FALSE cuenta inactiva

  fechaCreacion: string;           // DD/MM/YYYY
  fechaCreacionMillisecs: number;  // UNIX format

  /** disponible en cada Currency del sistema */
  saldoUSD: number;
  saldoEUR: number;
  saldoCOP: number;

  /** intereses diarios seteados para esta Cuenta */
  interesDiarioUSD: number;
  interesDiarioEUR: number;
  interesDiarioCOP: number;
  
}