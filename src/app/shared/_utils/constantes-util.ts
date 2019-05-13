import { trigger, state, style, transition, animate } from "@angular/animations";

export const CONSTANTES_UTIL = {
  
  /** Documentos */
  TIPODOC_EXTRANJERIA: 'CE',
  TIPODOC_CEDULA: 'CC',

  /** Estatus en la BD de Usuarios */
  USUARIO_ACTIVO: 'ACTIVO',
  USUARIO_INACTIVO: 'INACTIVO',

  /** Roles de Usuarios */
  ROL_INVERSIONISTA: 'Inversionista',
  ROL_ADMIN: 'Admin',
  ROL_ACADEMIA: 'Estudiante',

  /** PREFIJOS DE LOS ID's */
  PREFFIX_USER: 'U_',
  PREFFIX_ACCOUNT: 'A_',
  PREFFIX_CONTRATC: 'C_',
  PREFFIX_TRADING: 'M_',
  PREFFIX_DAY: 'TD_',/* Total del Dia */

  /** Fechas */
  DATE_SEPARATOR: '/',

  /** Usuarios */
  DEFAULT_PASSWORD: '123456789',

  /** Snackbar */
  SNACKBAR_DURATION_ERROR: 5000,
  SNACKBAR_DURATION_SUCCESS: 3000,

  /** ERRORES: mensajes al usuario */
  ERROR_FIREBASE_GET_ENTITIES: 'Ocurrió un error con la Base de Datos. Intente nuevamente más tarde',
  ERROR_CAMBIOS_NO_GUARDADOS : 'No se guardaron los cambios. Ocurrió un error. Intente nuevamente más tarde',
  ERROR_PASSWORDS_NO_COINCIDEN: 'Las Contraseñas no coinciden, ambas deben ser iguales',

  /** SUCCESS: mensajes al usuario */
  SUCCESS_USER_ACTIVATED: 'Usuario Activado correctamente',
  SUCCESS_USER_DEACTIVATED: 'Usuario Inactivado (no podrá ingresar al Sistema)',
  SUCCESS_CAMBIOS_GUARDADOS : 'Cambios salvados satisfactoriamente',
  SUCCESS_ACCOUNT_ACTIVATED: 'Cuenta Activada correctamente',
  SUCCESS_ACCOUNT_DEACTIVATED: 'Cuenta Inactivada (no podrá usarse en Contratos)',
}