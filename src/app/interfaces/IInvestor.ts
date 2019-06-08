/**
 * Usado como la Lista de INVERSIONISTAS que pertenecen a un CONTRATO
 */
export interface IInvestor {
  inversionistaId: string;
  activo: boolean;
  
  fechaActivo:   number; // millisecs cuando INGRESA al contrato, al momento de crear éste
  fechaInactivo: number; // millisecs cuando SE DA DE BAJA y se va, hay que sacarlo y liquidarlo

  responsable: boolean;   // TRUE si es Responsable del contrato
  aporteMonto: number;    // dinero que aporta para entrar al Contrato
  aporteCurrency: string; // {USD, EUR, COP}
}