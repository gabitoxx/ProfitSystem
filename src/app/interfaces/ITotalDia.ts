export interface ITotalDia {
 
  id: string;             // UUID CONSTANTES_UTIL.PREFFIX_DAY + fecha: AAAAMMDD
  idDiaAnterior:string;   // UUID del día anterior a éste

  fecha: string;            // DD/MM/YYYY
  fechaMillisecs: number;   // UNIX timestamp

  adminId: string;          // el que creó este Movimiento

  /* 
   * SUMATORIA de las Constantes Diarias de todos los Contratos Involucrados
   * se debe tomar la del Contrato
   * (Intereses diarios de cada Cuenta)
   */
  sumConstanteDiariaUSD: number;  // ej: celda I11
  sumConstanteDiariaEUR: number;
  sumConstanteDiariaCOP: number;

  /*
   * La SUMATORIA de TODOS los Movimientos del Día
   */
  totalAcumUSD: number;   // ej: celda L11
  totalAcumEUR: number;
  totalAcumCOP: number;

  /*
   * SALDO PARA LA EMPRESA (USD $) = totalAcumUSD - sumConstanteDiariaUSD + (saldoProfitUSD del dia anterior)
   * Ganancia o Perdida de la empresa
   */
  saldoProfitUSD: number;
  saldoProfitEUR: number;
  saldoProfitCOP: number;
}