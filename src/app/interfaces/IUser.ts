export interface IUser {

  id: string;           // CONSTANTES_UTIL.PREFFIX_USER + Date in millisecs
  nombres: string;
  apellidos: string;
  rol: string;          // CONSTANTES_UTIL.ROL_INVERSIONISTA ? ROL_ADMIN ? ROL_ACADEMIA
  email: string;
  password: string;
  telefono: string;
  ciudad: string;
  direccion: string;
  hobbies: string;
  status: string;        // CONSTANTES_UTIL.USUARIO_ACTIVO ? USUARIO_INACTIVO
  fechaCreacion: string; // DD/MM/YYYY
  responsable?: boolean; // solo para la vista
  contratoId: string;    // un Inversionista puede estar SOLO EN UN CONTRATO a la vez
}