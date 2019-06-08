import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { AccountService } from 'src/app/services/account.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { IAccount } from 'src/app/interfaces/IAccount';
import { IContract } from 'src/app/interfaces/IContract';
import { ContractService } from 'src/app/services/contract.service';
import { IUser } from 'src/app/interfaces/IUser';
import { UsersService } from 'src/app/services/users.service';
import { ValidatorUtils } from 'src/app/shared/_utils/validator-utils';
import { ITrading } from 'src/app/interfaces/ITrading';
import { TradingService } from 'src/app/services/trading.service';
import { TotalDayService } from 'src/app/services/total-day.service';
import { ITotalDia } from 'src/app/interfaces/ITotalDia';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-create-trading',
  templateUrl: './create-trading.component.html',
  styleUrls: ['./create-trading.component.css']
})
export class CreateTradingComponent implements OnInit {

  fecha: Date    = null;
  fechaHoy: Date = null;
  hoy: number = 0;

  /* Form */
  currency:string = CONSTANTES_UTIL.CURRENCY_DOLAR;
  account:string = "";
  debito:number = 0.0;
  calculoOperacionUSD:number = 0.0;
  calculoOperacionEUR:number = 0.0;
  calculoOperacionCOP:number = 0.0;


  /* Cuentas */
  accounts:IAccount[] = [];
  accountSelected:IAccount = null;
  accountAvailableUSD:number = 0.0;
  accountAvailableEUR:number = 0.0;
  accountAvailableCOP:number = 0.0;

  /** Contratos: TODOS y los de la Cuenta seleccionada */
  contracts:IContract[] = [];
  accountSelectedContracts:IContract[] = [];

  //
  users: IUser[] = [];
  movimientos:ITotalDia[] = [];
  acumuladoDiaAnterior:ITotalDia = null;

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;

  /*
   * Flag para cuando te da el problema del loop infinito al obtener un valor que luego has de editar
   */
  bCreandoTrading:boolean = false;
  bCreandoAcumDia:boolean = false;
  bCargandoMovs:boolean = false;

  
  constructor(
      private router: Router,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private accountService: AccountService,
      private contractService: ContractService,
      private userService: UsersService,
      private tradingService: TradingService,
      private totalDayService: TotalDayService){

    this.configError = {
      panelClass: ['snackbar-accion-failure'],
      duration: CONSTANTES_UTIL.SNACKBAR_DURATION_ERROR,
    };
    
    this.configSuccess = {
      panelClass: ['snackbar-accion-succes'],
      duration: CONSTANTES_UTIL.SNACKBAR_DURATION_SUCCESS,
    };

    this.bCreandoTrading = false;
    this.bCreandoAcumDia = false;
    this.bCargandoMovs   = false;

    /**
     * CONFIG: crear el primero primero, en ceros zero
     * /
    var ac:ITotalDia = {
>>      id: CONSTANTES_UTIL.PREFFIX_DAY + ValidatorUtils.getFechaFormato2(), // TD_20190528 usar el dia anterior al 1er pase a PROD despliegue
      idDiaAnterior: "",
      fecha: ValidatorUtils.getFechaFormato1(),
      fechaMillisecs: Date.now(),
      
      adminId: "U_1557160176431", // Gabo Admin
      sumConstanteDiariaUSD: 0.0,
      sumConstanteDiariaEUR: 0.0,
      sumConstanteDiariaCOP: 0.0,
      totalAcumUSD: 0.0,
      totalAcumEUR: 0.0,
      totalAcumCOP: 0.0,
      saldoProfitUSD: 0.0,
      saldoProfitEUR: 0.0,
      saldoProfitCOP: 0.0,
    }
    this.totalDayService.createAcumDay(ac).then(
        () => {
          console.log("Creo bien el 1er /acumulados/", ac.id)
        }, (error) => {
          console.error("error creando movimiento Zero:", ac, error)
        }
    );
*/
  }

  ngOnInit() {
    this.fecha = this.fechaHoy = new Date( Date.now() );

    this.loadUsers();
    this.loadContratos();
    this.loadCuentas();
    this.loadAcumulados();
    
  }

  goHome(){
    this.router.navigate(["admin/home"]);
  }

  loadCuentas = () => {
    this.accountService.getAccounts().valueChanges().subscribe(
      ( data: IAccount[] ) => {
        this.accounts = data;
        
      }, (error) => {
        console.error('CreateTradingComponent.loadCuentas() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }

  loadContratos = () => {
    this.contractService.getContracts().valueChanges().subscribe(
      ( data: IContract[] ) => {
        this.contracts = data;
        
      }, (error) => {
        console.error('CreateTradingComponent.loadContratos() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }

  loadUsers() {
    this.userService.getUsers().valueChanges().subscribe(
      ( data: IUser[] ) => {
        this.users = data;
        
      }, (error) => {
        console.error('CreateContractComponent.loadUsers() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }

  loadAcumulados() {
    this.totalDayService.getAcumDays().valueChanges().subscribe(
      ( data: ITotalDia[] ) => {

        this.movimientos = data.reverse();
        //console.log('this.movimientos',this.movimientos)
        
        console.log('this.movimientos[ultimo]',this.movimientos[0])
        this.acumuladoDiaAnterior = this.movimientos[0];
        
        // para no ocupar tanta memoria
        this.movimientos = [];

      }, (error) => {
        console.error('CreateContractComponent.loadMovimientos() - error:', error);
      }
    );
  }

  

  selectedAccount(cuentaId: string){
    
    var c:IAccount;
    this.accountSelectedContracts = [];

    recorrerCuentas:
    for ( var i = 0; i < this.accounts.length; i++ ){
      if ( this.accounts[i].id == cuentaId ){
        c = this.accounts[i];
        break;
      }
    }
    this.accountSelected = c;
    this.accountAvailableUSD = c.saldoUSD;
    this.accountAvailableEUR = c.saldoEUR;
    this.accountAvailableCOP = c.saldoCOP;

    var msgContratos = '';

    recorrerContratos:
    for ( var i = 0; i < this.contracts.length; i++ ){
      if ( this.contracts[i].cuentaId == cuentaId ){
        this.accountSelectedContracts.push( this.contracts[i] );
      }
    }
  }


  /**
   * Actualizando automaticamente la operacion
   */
  focusOperacion = () => {

    // re-inicializacion
    this.calculoOperacionUSD = this.accountSelected.saldoUSD;
    this.calculoOperacionEUR = this.accountSelected.saldoEUR;
    this.calculoOperacionCOP = this.accountSelected.saldoCOP;

    // calcula segun el currency
    if ( this.currency == CONSTANTES_UTIL.CURRENCY_DOLAR ){
      this.calculoOperacionUSD = this.accountSelected.saldoUSD + this.debito;

    } else if ( this.currency == CONSTANTES_UTIL.CURRENCY_EURO ){
      this.calculoOperacionEUR = this.accountSelected.saldoEUR + this.debito;

    } else if ( this.currency == CONSTANTES_UTIL.CURRENCY_PESO_CO ){
      this.calculoOperacionCOP = this.accountSelected.saldoCOP + this.debito;
    }
  }


  verMasDetalles(contratoId:string){
    for ( var i = 0; i < this.contracts.length; i++ ){
      if ( this.contracts[i].id == contratoId ){
        var c:IContract = this.contracts[i];
        var u:IUser = ValidatorUtils.getUsuario(c.responsableId, this.users);
        alert("Contrato: \nID: " + c.id 
            + "\nNombre: " + c.nombre
            + "\nNº Inversionistas: " + c.inversionistas.length
            + "\nPorcentaje Rentabilidad: " + c.porcentaje + "%"
            + "\nResponsable: " + u.nombres + " " + u.apellidos
            + "\nDía de Corte: " + c.diaCorteMes
            + "\n_____________________"
            + "\nCapital del Contrato:"
            + "\nUSD: " + CONSTANTES_UTIL.MONEDA_USD + " " + c.capitalContratoUSD
            + "\nEUR: " + CONSTANTES_UTIL.MONEDA_EUR + " " + c.capitalContratoEUR
            + "\nCOP: " + CONSTANTES_UTIL.MONEDA_COP + " " + c.capitalContratoCOP
            + "\n_____________________"
            + "\nConstates de Deuda diaria:"
            + "\nUSD: " + CONSTANTES_UTIL.MONEDA_USD + " " + c.constanteDeudaUSD
            + "\nEUR: " + CONSTANTES_UTIL.MONEDA_EUR + " " + c.constanteDeudaEUR
            + "\nCOP: " + CONSTANTES_UTIL.MONEDA_COP + " " + c.constanteDeudaCOP
        );
        break;
      }
    }
  }


  validForm = ():boolean => {
    
    if ( this.fecha == null || this.fecha == undefined ){
      this.snackBar.open('Especifique la Fecha de este Movimiento.', 'Ok', this.configError);
      return false;
    } else if ( this.accountSelected == null || this.accountSelected == undefined ){
      this.snackBar.open('Seleccione una de las Cuentas.', 'Ok', this.configError);
      return false;
    } else if ( this.debito == null || this.debito == undefined ){
      this.snackBar.open('Indique Monto de este Movimiento.', 'Ok', this.configError);
      return false;
    } else if ( this.currency == null || this.currency == undefined || this.currency == '' ){
      this.snackBar.open('En qué Moneda se hizo esta operación?.', 'Ok', this.configError);
      return false;
    }

    return true;
  }


  /**
   * 1.- crear entity ITrading en Firebase
   * 2.- Actualizar entity IAccount relacionado en Firebase CON el nuevo Saldo
   * 3.- Verificar si ya existe en Firebase el entity ITotalDia del día this.fecha
   *  3.1.- Si NO existe, crear con los resultados de éste Movimiento 
   *  3.2.- Si existe, actualizar con los saldos de éste Movimiento 
   */
  newTrading(){
    // alert('1. Crear Movimiento en la BD, 2.  Snackbar avisando creacion exitosa (podrá verse todos los tradings en la pág de consulta de Movimientos) y volver a pág de inicio');

    if ( !this.validForm() ){
      return;
    } else {
      this.bCreandoTrading = true;
      console.log("--> newTrading()");
    }

    this.hoy = Date.now();

    var mov:ITrading = {
      id: CONSTANTES_UTIL.PREFFIX_TRADING + this.hoy,
      accountId: this.accountSelected.id,
      fecha: ValidatorUtils.getFechaFormato1(),
      fechaMillisecs: this.hoy,
      monto: this.debito,
      currency: this.currency,
      adminId: "U_1558735692972" // XXX este admin logueado!!
    }

    this.tradingService.createTrading( mov ).then(
        () => {
          console.log("tradingService.createTrading() - OK - con id:", mov.id);
          this.actualizarSaldoCuenta();

        }, (error) => {
          console.error('CreateTradingComponent.newTrading() - error:', error);
          this.snackBar.open("Movimiento: " + CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
        }
    );
  }

  /**
   * Actualiza el Saldo después de ESTE MOVIMIENTO segun el Monto y Currency seleccionado
   */
  actualizarSaldoCuenta() {
    console.log("--> actualizarSaldoCuenta()");
    
    if ( this.bCreandoTrading == true ){
      this.bCreandoTrading = false;
    } else {
      return;
    }

    if ( this.currency == CONSTANTES_UTIL.CURRENCY_DOLAR ){
      this.accountSelected.saldoUSD += this.debito;

    } else if ( this.currency == CONSTANTES_UTIL.CURRENCY_EURO ){
      this.accountSelected.saldoEUR += this.debito;

    } else if ( this.currency == CONSTANTES_UTIL.CURRENCY_PESO_CO ){
      this.accountSelected.saldoCOP += this.debito;
    }
    
    this.accountService.editAccount( this.accountSelected ).then(
        () => {
          console.log("Cuenta actualizada con CUR, Debito, CUENTA_TOTAL:", this.currency, this.debito, this.accountSelected );
          this.bCreandoAcumDia = true;
          this.acumuladoDia();
          
        }, (error) => {
          console.error('CreateTradingComponent.actualizarSaldosCuenta() - error:', error);
          this.snackBar.open("Movimiento: Se presentó un Problema para actualizar el saldo de la cuenta (NEW SALDO)", 'Ok', this.configError);
        }
    );
  }

  /**
   * Busca si existe el Acumulado de THIS.FECHA => si SÏ lo obtiene y actualiza; si NO crearlo
   */
  acumuladoDia() {
    console.log("--> acumuladoDia()");
    
    this.totalDayService.getAcumDayByDate( this.fecha )
    .valueChanges()           // .snapshotChanges()
    .subscribe(               // .forEach(snapshot => { console.log("snapshot", snapshot, "key::",snapshot.payload.key);
        (firebase: ITotalDia) => {
            if ( this.bCreandoAcumDia == true ){
              this.bCreandoAcumDia = false;
            } else {
              return;
            }
            if ( null != firebase ){
              console.log("SI hay Acumulado del dia (former) y es (latter): ", this.fecha, firebase );
              this.actualizarAcumuladoDelDia( firebase );

            } else {
              console.log("NO hay Acumulado del dia:", this.fecha, firebase );
              this.crearAcumuladoDelDia();
            }
        
        }, (error) => {
          console.error("CreateTradingComponent.acumuladoDia() - Error buscando total del Dia (former) y error (latter): ", this.fecha, error );
        
        }
        
    );
    
  }

  /**
   * NO existe el Acumulado del dia, se debe Crear
   */
  crearAcumuladoDelDia = () => {
    console.log("--> crearAcumuladoDelDia()");
    
    // Acumulado de hoy, este es el primer Movimiento del dia
    const diaUSD = ( this.currency == CONSTANTES_UTIL.CURRENCY_DOLAR ) ? this.debito : 0;
    const diaEUR = ( this.currency == CONSTANTES_UTIL.CURRENCY_EURO ) ? this.debito : 0;
    const diaCOP = ( this.currency == CONSTANTES_UTIL.CURRENCY_PESO_CO ) ? this.debito : 0;

    // Tema de la Constante
    const sumatoriaUSD = 0;  // xxx ? DUDAs del email del dia 28/05 a profitakers1@gmail.com
    const sumatoriaEUR = 0;
    const sumatoriaCOP = 0;

    var idTotalDayAnterior = (this.acumuladoDiaAnterior != null) ? this.acumuladoDiaAnterior.id : '';

    // Nuevo acumulado
    var acum:ITotalDia = {
      id: CONSTANTES_UTIL.PREFFIX_DAY + ValidatorUtils.getFechaFormato2Date( this.fecha ),
      idDiaAnterior: idTotalDayAnterior,

      fecha: ValidatorUtils.getFechaFormato1Date( this.fecha ),
      fechaMillisecs: this.hoy,
      
      adminId: "U_1558735692972", // XXX este admin logueado!!

      sumConstanteDiariaUSD: sumatoriaUSD,
      sumConstanteDiariaEUR: sumatoriaEUR,
      sumConstanteDiariaCOP: sumatoriaCOP,

      totalAcumUSD: diaUSD,
      totalAcumEUR: diaEUR,
      totalAcumCOP: diaCOP,
      
      saldoProfitUSD: (diaUSD - sumatoriaUSD) + (this.acumuladoDiaAnterior != null ? this.acumuladoDiaAnterior.saldoProfitUSD : 0),
      saldoProfitEUR: (diaEUR - sumatoriaEUR) + (this.acumuladoDiaAnterior != null ? this.acumuladoDiaAnterior.saldoProfitEUR : 0),
      saldoProfitCOP: (diaCOP - sumatoriaCOP) + (this.acumuladoDiaAnterior != null ? this.acumuladoDiaAnterior.saldoProfitCOP : 0),
    }

    this.totalDayService.createAcumDay( acum ).then(
        () => {
          console.log("Se registró bien el acumulado del dia bajo el ID: " + acum.id);
          this.snackBar.open("Se registró el Movimiento y su Acumulado diario satisfactoriamente.", 'Ok', this.configSuccess);
          this.goHome();

        }, (error) => {
          console.error('CreateTradingComponent.crearAcumuladoDelDia() - error:', error, this.fecha, this.debito, this.currency, this.accountSelected);
          this.snackBar.open("Acumulado del Día: hubo un Problema para crear el Registro del Acumulado del dia", 'Ok', this.configError);
        } 
    );
  }

  /**
   * Si ya existe este acumulado porque alguien creó un Movimiento anterior en la misma fecha
   * se debe actualizar los salos acumulados
   */
  actualizarAcumuladoDelDia = (acum: ITotalDia) => {
    console.log("--> actualizarAcumuladoDelDia()");

    // sumar el acumulado segun currency al respectivo
    const diaUSD = ( this.currency == CONSTANTES_UTIL.CURRENCY_DOLAR ) ? acum.totalAcumUSD + this.debito : acum.totalAcumUSD;
    const diaEUR = ( this.currency == CONSTANTES_UTIL.CURRENCY_EURO )  ? acum.totalAcumEUR + this.debito : acum.totalAcumEUR;
    const diaCOP = ( this.currency == CONSTANTES_UTIL.CURRENCY_PESO_CO)? acum.totalAcumCOP + this.debito : acum.totalAcumCOP;

    acum.totalAcumUSD = diaUSD;
    acum.totalAcumEUR = diaEUR;
    acum.totalAcumCOP = diaCOP;

    // actualizar el tema de la constante diaria
    const sumatoriaUSD = 0;  // xxx ? DUDAs del email del dia 28/05 a profitakers1@gmail.com
    const sumatoriaEUR = 0;
    const sumatoriaCOP = 0;

    acum.sumConstanteDiariaUSD = sumatoriaUSD;
    acum.sumConstanteDiariaEUR = sumatoriaEUR;
    acum.sumConstanteDiariaCOP = sumatoriaCOP;
    
    // Acumulado Profit se actualiza; da Ganancia o Perdida
    acum.saldoProfitUSD = diaUSD - sumatoriaUSD + ( this.acumuladoDiaAnterior != null ? this.acumuladoDiaAnterior.saldoProfitUSD : 0 );
    acum.saldoProfitEUR = diaEUR - sumatoriaEUR + ( this.acumuladoDiaAnterior != null ? this.acumuladoDiaAnterior.saldoProfitEUR : 0 );
    acum.saldoProfitCOP = diaCOP - sumatoriaCOP + ( this.acumuladoDiaAnterior != null ? this.acumuladoDiaAnterior.saldoProfitCOP : 0 );

    this.totalDayService.editAcumDay( acum ).then(
        () => {
          console.log("Se actualizó bien el acumulado del dia bajo el ID: " + acum.id);
          this.snackBar.open("Se registró el Movimiento y su Acumulado diario correctamente.", 'Ok', this.configSuccess);
          this.goHome();

        }, (error) => {
          console.error('CreateTradingComponent.crearAcumuladoDelDia() - error:', error, this.fecha, this.debito, this.currency, this.accountSelected);
          this.snackBar.open("Acumulado del Día: hubo un Problema para actualizar el Registro del Acumulado del día.", 'Ok', this.configError);
        }
    );

  }

}
