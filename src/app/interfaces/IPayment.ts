export interface IPayment {
  
  id: string;           // UUID CONSTANTES_UTIL.PREFFIX_PAYMENT + Date in millisecs
  
  /* relativo al archivo */
  idFile: string;       // PREFFIX_PAYMENT_IMAGE  // imagen archivo adjunto
  fileExtension: string;// solo .JPEG, .JPG, .PNG
  fileName: string;

  /* relativo al formulario del pago */
  banco: string;
  fecha: string;              // Fecha DD/MM/YYYY
  fechaMillisecs: number;     // misma fecha pero en formato UNIX
  monto: number;
  currency: string;           // {USD, EUR, COP}
  concepto: string;
  destino: string;            // { Inversion, Academia }
  idUser: string;             // Usuario que pagó

  aprobado: boolean;          // solo un Admin puede aprobarlo
}