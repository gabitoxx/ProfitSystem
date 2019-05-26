export interface IUser {

  id: string;           // CONSTANTES_UTIL.PREFFIX_USER + Date in millisecs
  nombres: string;
  apellidos: string;
  rol: string;           // CONSTANTES_UTIL.ROL_INVERSIONISTA ? ROL_ADMIN ? ROL_ACADEMIA
  status: string;        // CONSTANTES_UTIL.USUARIO_ACTIVO ? USUARIO_INACTIVO
  email: string;
  password: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  hobbies: string;
  fechaCreacion: string; // DD/MM/YYYY
  
  responsable?: boolean; // solo para la vista
  
  contratoId: string;    // un Inversionista puede estar SOLO EN UN CONTRATO a la vez
  
  avatar?:string;        // nombre de Archivo, ej: PI_12345678
  avatarURL?:string;     // URL que genera Firebase Storage de la imagen
  
  /*
   * Saldo Disponible de los Pagos que va registrando, los cuales suman este Acumlador.
   * Si los usa para un Contrato se debe ir descontando este Acumulador
   */
  saldoDisponibleUSD?: number;
  saldoDisponibleEUR?: number;
  saldoDisponibleCOP?: number;

  /* 
   * Si genera intereses, acá se van sumando
   * Si Liquidan a Fin de mes, se va descontando
   */
  saldoDisponiblePorInteresesUSD?: number;
  saldoDisponiblePorInteresesEUR?: number;
  saldoDisponiblePorInteresesCOP?: number;

  /* info rápida */
  fechaUltimoPago?: number;         // Fecha en millisecs
  suscripcionActivo: boolean;       // solo si rol = Academia
  suscripcionFechaVence: number;    // Fecha en millisecs
}