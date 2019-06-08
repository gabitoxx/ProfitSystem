import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { TotalDayService } from 'src/app/services/total-day.service';
import { TradingService } from 'src/app/services/trading.service';
import { ITotalDia } from 'src/app/interfaces/ITotalDia';
import { ITrading } from 'src/app/interfaces/ITrading';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { IAccount } from 'src/app/interfaces/IAccount';
import { IUser } from 'src/app/interfaces/IUser';
import { UsersService } from 'src/app/services/users.service';
import { AccountService } from 'src/app/services/account.service';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

export interface ReporteDia {
  dia: string;
  acumulado: ITotalDia;
  movimientos: ITrading[];
}

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent implements OnInit {
  
  // el reporte final
  dataReporte:ReporteDia[] = [];

  // listas
  acumulados: ITotalDia[] = [];
  tradings:ITrading[]     = [];
  arrayAdmins:IUser[]     = [];
  arrayAccounts:IAccount[]= [];

  // fechas
  fechaDesde: Date = null;
  fechaHasta: Date = null;
  fechaHoy: Date   = null;
  fechaHace7: Date = null;

  // sumatoria del Reporte según fechas
  USD_TOTAL_ACUM:number = 0.0;
  USD_TOTAL_INTERESES:number = 0.0;
  USD_TOTAL_SALDOPROFIT:number = 0.0;
  EUR_TOTAL_ACUM:number = 0.0;
  EUR_TOTAL_INTERESES:number = 0.0;
  EUR_TOTAL_SALDOPROFIT:number = 0.0;
  COP_TOTAL_ACUM:number = 0.0;
  COP_TOTAL_INTERESES:number = 0.0;
  COP_TOTAL_SALDOPROFIT:number = 0.0;

  // 0:nada, 1: buscando... 2: construyendo... 3: ya!
  iBuildingReport:number = 0;

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;

  
  constructor(
      private router: Router,
      private snackBar: MatSnackBar,
      private acumService: TotalDayService,
      private userService: UsersService,
      private accountService: AccountService,
      private tradingService: TradingService){

    this.configError = {
      panelClass: ['snackbar-accion-failure'],
      duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
    };
    
    this.configSuccess = {
      panelClass: ['snackbar-accion-succes'],
      duration: CONSTANTES_UTIL.SNACKBAR_DURATION_SUCCESS,
    };
  }


  ngOnInit() {
    this.fechaHasta = this.fechaHoy = new Date( Date.now() );
    this.fechaDesde = new Date();
    this.fechaDesde.setDate( this.fechaHoy.getDate() - 7 );
    this.fechaHace7 = new Date( this.fechaDesde.getDate() );

    this.loadCuentas();
    this.loadAdmins();
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }


  loadCuentas() {
    this.accountService.getAccounts().valueChanges().subscribe(
        ( data: IAccount[] ) => {
          this.arrayAccounts = data;
        }, (error) => {
          console.error('TradingsComponent.loadCuentas() - error:', error);
          this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
        }
    );
  }

  
  loadAdmins = () => {
    this.userService.getUsers().valueChanges().subscribe(
        ( data: IUser[] ) => {
          
          var result: IUser[] = [];

          for ( var i = 0; i < data.length; i++ ){
            if ( data[i].rol == CONSTANTES_UTIL.ROL_ADMIN ){
              result.push( data[i] );
            }
          }
          this.arrayAdmins = result;

        }, (error) => {
          console.error('TradingsComponent.loadCuentas() - error:', error);
          this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
        }
    );
  }

  validForm = ():boolean => {
    if ( this.fechaHasta > this.fechaHoy ){
      this.snackBar.open("El tope Hasta no debe ser mayor a hoy.", 'Intentaré de nuevo', this.configError);
      return false;
    }

    var d30:Date = new Date();
    d30.setDate( this.fechaHoy.getDate() - 32 );
    if ( this.fechaDesde < d30 ){
      this.snackBar.open("El tope Desde no debe ser menor a 1 mes.", 'Intentaré de nuevo', this.configError);
      return false;
    }
    
    return true;
  }

  filtrar = () => {

    if ( !this.validForm() ){
      return;

    } else {
      this.dataReporte = [];
      this.iBuildingReport = 1;
      
      this.loadAcumulados();
    }
  }

  loadAcumulados() {
    if ( this.acumulados.length == 0 ){
      console.log("loading Acumulados...");
      this.acumService.getAcumDays().valueChanges().subscribe(
          ( data: ITotalDia[] ) => {
            this.acumulados = data;
            console.log("Acumulados cargados:" + data.length);

            this.loadTradings();

          }, (error) => {
            console.error('MovimientosComponent.loadAcumulados() - error:', error);
            this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
          }
      );
    } else {
      this.loadTradings();
    }
  }

  loadTradings(){
    if ( this.tradings.length == 0 ){
      console.log("loading Movimientos...");
      this.tradingService.getTradings().valueChanges().subscribe(
          ( data: ITrading[] ) => {
            this.tradings = data;
            console.log("Movimientos cargados:" + data.length);

            this.construirReporte();

          }, (error) => {
            console.error('MovimientosComponent.loadTradings() - error:', error);
            this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
          }
      );
    } else {
      this.construirReporte();
    }
  }

  construirReporte = () => {

    this.iBuildingReport = 2;

    /*
     * unica opcion TODO por ahora
     */
    var finish = this.construirReporteIntervalo( this.fechaDesde, this.fechaHasta );
    if ( finish ){
      this.llenarTotales();
    }
    
  }

  construirReporteIntervalo(desde:Date, hasta:Date):boolean {

    try {
      console.log("construirReporteIntervalo(" + desde + ", " + hasta + ")");

      // tope inicial
      var current = desde;

      var d,dd, m,mm, a, dia;

      var item = this.limpiarItem();

      do {
        // fecha por secciones
        d = current.getDate();
        m = current.getMonth() + 1;
        a = current.getFullYear();

        // 2 digitos
        dd = d < 10 ? "0" + d : "" + d;
        mm = m < 10 ? "0" + m : "" + m;

        // string fecha
        dia = dd + "/" + mm + "/" + a;
        console.log("item del dia " + dia + "...");

        //poblar objeto
        item.dia = dia;
        item = this.buscarMovsYAcumDelDia( item, a, mm, dd );

        // dataSource!!
        this.dataReporte.push( item );
        console.log("item:", item);

        item = this.limpiarItem();

        // siguiente dia
        current.setDate( current.getDate() + 1 );

      } while ( current <= hasta );

      // mostrar tabla
      this.iBuildingReport = 3;

      return true;

    } catch ( error ){
      console.error("construirReporteIntervalo.catch - ERROR:", error);
      return false;
    }
  }


  /**
   * Cada DIA debe tener muchos MOVIMIENTOS y un solo ACUMLADO
   * @param item: interface
   * @param anyo: full
   * @param mes: 2 digitos
   * @param dia: 2 digitos
   */
  buscarMovsYAcumDelDia = (item:ReporteDia, anyo:string, mes:string, dia:string):ReporteDia => {

    // ID del acumulado a buscar
    var current = "";

    unAcumulado:
    for ( var i = 0; i < this.acumulados.length; i++ ){

      current = CONSTANTES_UTIL.PREFFIX_DAY + anyo + mes + dia;

      if ( this.acumulados[i].id == current ){
        item.acumulado = this.acumulados[i];
        break;
      }
    }

    variosTradings:
    for ( var i = 0; i < this.tradings.length; i++ ){
      if ( this.tradings[i].fecha == item.dia ){
        item.movimientos.push( this.tradings[i] );
      }
    }

    return item;
  }


  limpiarItem():ReporteDia {
    var item:ReporteDia = {
      dia: '',
      acumulado: null,
      movimientos: []
    };
    return item;
  }

  getAdminName(userId:string){
    return ValidatorUtils.getUsuarioNombre( userId, this.arrayAdmins );
  }

  getCuentaName(cuentaId:string){
    return ValidatorUtils.getAccountName( cuentaId, this.arrayAccounts );
  }

  /**
   * LLENAR EL FOOTER FINAL DE ESTE REPORTE
   */
  llenarTotales(){
    
    this.limpiarTotales();
    
    if ( this.dataReporte.length > 0 ){
      for ( var i = 0; i < this.dataReporte.length; i++ ){
        //
        this.USD_TOTAL_ACUM += this.dataReporte[i].acumulado.totalAcumUSD;
        this.EUR_TOTAL_ACUM += this.dataReporte[i].acumulado.totalAcumEUR;
        this.COP_TOTAL_ACUM += this.dataReporte[i].acumulado.totalAcumCOP;
        //
        this.USD_TOTAL_INTERESES += this.dataReporte[i].acumulado.sumConstanteDiariaUSD;
        this.EUR_TOTAL_INTERESES += this.dataReporte[i].acumulado.sumConstanteDiariaEUR;
        this.COP_TOTAL_INTERESES += this.dataReporte[i].acumulado.sumConstanteDiariaCOP;
        //
        this.USD_TOTAL_SALDOPROFIT += this.dataReporte[i].acumulado.saldoProfitUSD;
        this.EUR_TOTAL_SALDOPROFIT += this.dataReporte[i].acumulado.saldoProfitEUR;
        this.COP_TOTAL_SALDOPROFIT += this.dataReporte[i].acumulado.saldoProfitCOP;
      }
    }
  }

  limpiarTotales = () => {
    this.USD_TOTAL_ACUM = 0.0;
    this.USD_TOTAL_INTERESES = 0.0;
    this.USD_TOTAL_SALDOPROFIT = 0.0;
    this.EUR_TOTAL_ACUM = 0.0;
    this.EUR_TOTAL_INTERESES = 0.0;
    this.EUR_TOTAL_SALDOPROFIT = 0.0;
    this.COP_TOTAL_ACUM = 0.0;
    this.COP_TOTAL_INTERESES = 0.0;
    this.COP_TOTAL_SALDOPROFIT = 0.0;
  }

  excel(){
    alert("TODO: pendiente programar para la fase 2");
  }

  /**
   * 
   * @param option {'right', 'left'}
   */
  pagination(option:string){
    if ( option == 'left' ){
      alert("Registros anteriores (TODO para la fase 2)");
    } else if ( option == 'right' ){
      alert("Registros posteriores (TODO para la fase 2)");
    }
  }
}
