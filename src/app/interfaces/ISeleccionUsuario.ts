
export interface ISeleccionUsuario {
  id: string;
  name: string;
  responsable: boolean;
  montoEntrada: number;
  currency: string;
  contratoId?: string;
}