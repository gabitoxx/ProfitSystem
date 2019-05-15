export interface IInvestor {
  id: string;
  activo: boolean;
  fechaActivo: number;   // millisecs
  fechaInactivo: number; // millisecs
}