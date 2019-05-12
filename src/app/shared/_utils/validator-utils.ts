import { FormBuilder, AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { CONSTANTES_UTIL } from "./constantes-util";
//import { FileValidator } from "ngx-material-file-input";

export class ValidatorUtils {

  public static tamanhoArchivoVal(maxLength: number, msg?: string): ValidatorFn {
    /*
    return (control: AbstractControl): ValidationErrors | null => {
      const ref = FileValidator.maxContentSize(maxLength);
      const r = ref(control);
      if (r) {
        r.message = msg;
        return r;
      }
      return null;
    };
    */
    return null;
  }

  public static extensionArchivo(msg?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value) {
        console.log('Valor: ' + control.value._fileNames + ' - ' + this.validateExtention(control.value._fileNames));
        if (this.validateExtention(control.value._fileNames)) {
          return null;
        } else {
          return {
            extensionArchivo: false,
            message: msg
          };
        }

      }
    };
  }

  public static validateExtention(archivo: string) {
    const re = /^.*\.(jpg|JPG|jpeg|JPEG|png|PNG)$/;
    return re.test(archivo);
  }

  /**
    * Metodo que permite validar si el campo es requido.
    * @param msg
    */
  public static required(msg?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const res = Validators.required(control);
      if (res) {
        res.message = msg;
        return res;
      }
      return null;
    };
  }

  /**
  * Metodo que permite validar el minimo de caracteres digitados.
  * @param minLength
  * @param msg
  */
  public static minLength(minLength: number, msg?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const ref = Validators.minLength(minLength);
      const r = ref(control);
      if (r) {
        r.message = msg;
        return r;
      }
      return null;
    };
  }

  /**
   * Metodo que permite validar el máximo de caracteres digitados.
   * @param maxLength
   * @param msg
   */
  public static maxLength(maxLength: number, msg?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const ref = Validators.maxLength(maxLength);
      const r = ref(control);
      if (r) {
        r.message = msg;
        return r;
      }
      return null;
    };
  }

  /**
   * Metodo que permite validar el máximo valor de un campo.
   * @param maxValue
   * @param msg
   */
  public static maxValue(maxValue: number, msg?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const ref = Validators.max(maxValue);
      const r = ref(control);
      if (r) {
        r.message = msg;
        return r;
      }
      return null;
    };
  }

  /**
   * Metodo que permite validar estructura del correo eléctronico
   * @param msg
   */
  public static email(msg?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (control.value && this.validateEmail(control.value)) {
        return null;
      } else {
        return {
          email: false,
          message: msg
        };
      }
    };
  }

  /**
   * Metodo que permite validar estructura del correo eléctronico
   * @param email
   */
  public static validateEmail(email: string) {
    // tslint:disable-next-line:max-line-length
    // tslint:disable-next-line:prefer-const
    var re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/;
    return re.test(email);
  }

  /**
   * Metodo que permite solo texto en los input
   * @param e
   */
  keyPressValTexto(e) {
    if (e.code != 'Tab') {
      var tecla = (document.all) ? e.keyCode : e.which; // 2
      if (tecla == 8) return true; // 3
      var patron = /[a-zA-ZñÑá-úÁ-Ú\s]/; // 4
      var te = String.fromCharCode(tecla); // 5
      return patron.test(te); // 6
    }
  }

  /**
   * Metodo que permite solo números en los input
   * @param e
   */
  soloNumeros(e) {
    if (e.code != 'Tab') {
      var tecla = (document.all) ? e.keyCode : e.which; // 2
      if (tecla == 8) return true; // 3
      var patron = /\d/; // 4
      var te = String.fromCharCode(tecla); // 5
      return patron.test(te); // 6
    }
  }

  /**
   * Valida el n úmero de documento a digitar.
   * Si es cedula solo permite números de lo contrario permite 
   * letras.
   * @param event 
   * @param tipoIdentificacion 
   */
  keyPressValDocumento(event: any, tipoIdentificacion: string) {
    var tecla = (document.all) ? event.keyCode : event.which;
    var patron = /[A-Za-z0-9]/;
    if (event.code != 'Tab' && event.code != 'Backspace') {
      if (tipoIdentificacion !== CONSTANTES_UTIL.TIPODOC_EXTRANJERIA) {
        return this.soloNumeros(event);
      } else {
        var tecla_final = String.fromCharCode(tecla);
        return patron.test(tecla_final);
      }
    }
  }

  /**
   * Filtra la fecha hasta la actual.
   */
  fiterCurrent = (date: Date): boolean => {
    return date < (new Date());
  }

  public static pattern(pattern: string, msg?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const ref = Validators.pattern(pattern);
      const r = ref(control);
      if (r) {
        r.message = msg;
        return r;
      }
      return null;
    };
  }

  /**
   * Metodo que permite indicar que el campo es obligatorio.
   * @param e
   */
  public getValidationRequired(): { [key: string]: any } {
    return [null, Validators.compose([
      ValidatorUtils.required('Debe diligenciar este campo.')
    ]
    )];
  }

  /**
   * Formatear fecha yyyy-mm-dd
   * @param date 
   */
  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  public static titleCase = (str:string) => {
    if ((str===null) || (str==='')) {
      return '';
    } else {
      str = str.toString();
    }

    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  public static randomInt(min:number, max:number){
    return Math.floor( Math.random() * (max - min + 1) ) + min;
  }

  public static transformNames = (names:string) => {
    var re = / /gi;
    if (names.search(re) == -1 ) { 
      //console.log("Does not contain espacios"); 
      return names;
    } else { 
      //console.log("Contains espacios" );
      return ValidatorUtils.titleCase(names);
    }
  }

  public static onlyNumbers(num:string){
    var reg = new RegExp('^[0-9]+$');
    return (num.search(reg) == -1 ) ? false : true;
  }
  
  public static onlyLetters = (num:string) => {
    /* minuscualasMAYUSCULAS<espacio en blanco> */
    var reg = new RegExp('^[a-zA-Z ]+$');
    return (num.search(reg) == -1 ) ? false : true;
  }

  /**
   * @returns Fecha actual en formato DD/MM/YYYY
   */
  public static getFechaFormato1 = () => {
    let date = new Date();
    const y = date.getFullYear();
    const m = ( date.getMonth() + 1 );
    const d = date.getDate();
    const f = d + CONSTANTES_UTIL.DATE_SEPARATOR + m + CONSTANTES_UTIL.DATE_SEPARATOR + y;
    return f;
  }

}