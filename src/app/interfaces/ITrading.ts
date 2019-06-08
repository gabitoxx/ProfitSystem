export interface ITrading {
  
  id: string;              // UUID CONSTANTES_UTIL.PREFFIX_TRADING + Date in millisecs
  accountId: string;       // Cuenta afectada con este Movimiento

  fecha: string;           // DD/MM/YYYY
  fechaMillisecs: number;  // UNIX timestamp
  
  monto: number;     // giro en capital moneda
  currency:string;   // 'USD', 'EUR' ó 'COP'

  adminId: string;     // ADMIN que hizo este movimiento

}