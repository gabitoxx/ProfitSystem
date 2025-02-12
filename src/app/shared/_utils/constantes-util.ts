import { trigger, state, style, transition, animate } from "@angular/animations";

export const CONSTANTES_UTIL = {
  
  SI: 'Sí',
  NO: 'No',

  /** Monedas */
  CURRENCY_DOLAR: 'USD',
  CURRENCY_EURO: 'EUR',
  CURRENCY_PESO_CO: 'COP',
  MONEDA_USD: '$',
  MONEDA_EUR: '€',
  MONEDA_COP: '$',

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
  PREFFIX_PAYMENT: 'P_',
  PREFFIX_PAYMENT_IMAGE: 'PI_',
  PREFFIX_FOTO: 'F_', // Foto de Perfil

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
  ERROR_NO_SESSIONSTORAGEKEY: 'Su sesión ha expirado. Favor hacer Login de nuevo',
  

  /** SUCCESS: mensajes al usuario */
  SUCCESS_USER_ACTIVATED: 'Usuario Activado correctamente. Se le envió un email notificándole su activación, a la cuenta: ',
  SUCCESS_USER_DEACTIVATED: 'Usuario Inactivado (no podrá ingresar al Sistema)',
  SUCCESS_CAMBIOS_GUARDADOS : 'Cambios salvados satisfactoriamente',
  SUCCESS_ACCOUNT_ACTIVATED: 'Cuenta Activada correctamente',
  SUCCESS_ACCOUNT_DEACTIVATED: 'Cuenta Inactivada (no podrá usarse en Contratos)',
  SUCCESS_CONTRACT_ACTIVATED: 'Contrato Activado correctamente',
  SUCCESS_CONTRACT_DEACTIVATED: 'Contrato Inactivado',


  /** Archivos */
  FIRESTORAGE_NODO_PAGOS: 'img/pagos/png/',    // Pagos hechos en formato .PNG
  FIRESTORAGE_NODO_AVATAR: 'img/avatar/png/',  // imagenes del Perfil
  EXTENSION_PNG: '.png',
  EXTENSION_JPG: '.jpg',
  EXTENSION_JPEG: '.jpeg',

  /**  
   * Divisor de la ecuación del Porcentaje de Rentabilidad pactado mensual
   */
  DIVISOR_CONSTANTE_PRPM: 22,

  /**
   * Alturas de lo modales
   */
  MODAL_ANCHO_1: '550px',
  MODAL_ALTO_1: '90%',
  MODAL_ANCHO_2: '850px',
  MODAL_ALTO_2: '650px',
  
  /**
   * Session Storage
   */
  key: 'invprfTkrslgg',
}