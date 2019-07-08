import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './academia/home/home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { PerfilComponent } from './academia/perfil/perfil.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { CreateUserComponent } from './admin/create-user/create-user.component';
import { CreateAccountComponent } from './admin/create-account/create-account.component';
import { CreateTradingComponent } from './admin/create-trading/create-trading.component';
import { CreateContractComponent } from './admin/create-contract/create-contract.component';
import { RequestCredentialsComponent } from './request-credentials/request-credentials.component';
import { PaymentsComponent } from './admin/payments/payments.component';
import { PagoComponent } from './academia/pago/pago.component';
import { UsersComponent } from './admin/users/users.component';
import { AccountsComponent } from './admin/accounts/accounts.component';
import { ContractsComponent } from './admin/contracts/contracts.component';
import { HistorialPagosComponent } from './academia/historial-pagos/historial-pagos.component';
import { PersonaComponent } from './admin/reportes/persona/persona.component';
import { TradingsComponent } from './admin/tradings/tradings.component';
import { MovimientosComponent } from './admin/reportes/movimientos/movimientos.component';
import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
  /*  { path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard] }, */
    { path: '',      component: LoginComponent },  
    { path: 'login', component: LoginComponent },
    { path: 'nueva/cuenta', component: RequestCredentialsComponent },

    /*
     * Academia
     */
    { path: 'inversionistas', children: [
        { path: 'home', component: HomeComponent },
        { path: 'perfil', component: PerfilComponent },
        { path: 'pago/registrar', component: PagoComponent },
        { path: 'historial/pagos', component: HistorialPagosComponent },
      ],  canActivate: [ AuthGuard ]
    },

    /*
     * Administradores
     */
    { path: 'admin', children: [
        { path: 'home', component: AdminHomeComponent },
        { path: 'profile', component: ProfileComponent },
        { path: 'createUser', component: CreateUserComponent },
        { path: 'users', component: UsersComponent },
        { path: 'createAccount', component: CreateAccountComponent },
        { path: 'accounts', component: AccountsComponent },
        { path: 'createTrading', component: CreateTradingComponent },
        { path: 'tradings', component: TradingsComponent },
        { path: 'createContract', component: CreateContractComponent },
        { path: 'contracts', component: ContractsComponent },
        { path: 'payments', component: PaymentsComponent },
        /** Reportes */
        { path: 'reportes/persona', component: PersonaComponent },
        { path: 'reportes/movimientos', component: MovimientosComponent },
      ],  canActivate: [ AuthGuard ]
    },

    /* Any other address */
    { path: '**', pathMatch: 'full', redirectTo: 'login' },
    { path: '**', component: LoginComponent }
  ];

@NgModule({
  imports: [
    RouterModule.forRoot( 
      appRoutes,      /* encargado de leer las URLs del navegador, tambien si el usuario las escribe a mano */
      {scrollPositionRestoration: 'enabled'}  /* ExtraOptions: Represents options to configure the router {esto es como hacer window.scroll(0, 0)} -> https://angular.io/api/router/ExtraOptions#scrollPositionRestoration */
    ),
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
