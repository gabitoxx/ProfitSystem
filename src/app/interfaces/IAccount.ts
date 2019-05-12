export interface IAccount {

  id: string;             // CONSTANTES_UTIL.PREFFIX_ACCOUNT + Date in millisecs
  nombre: string;
  descripcion: string;
  currency: string;
  available: number;
  gestorId: string        // CONSTANTES_UTIL.PREFFIX_USER + Date in millisecs  ( ADMINISTRADOR )
  estatusActivo: boolean; // TRUE activo; FALSE cuenta inactiva
  fechaCreacion: string;  // DD/MM/YYYY
}