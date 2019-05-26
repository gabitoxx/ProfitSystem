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

const appRoutes: Routes = [
  /*  { path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard] }, */
    { path: '',      component: LoginComponent },  
    { path: 'login', component: LoginComponent },
    { path: 'nueva/cuenta', component: RequestCredentialsComponent },

    /*
     * Academia
     */
    { path: 'inversionistas/home', component: HomeComponent },
    { path: 'inversionistas/perfil', component: PerfilComponent },
    { path: 'inversionistas/pago/registrar', component: PagoComponent },
    { path: 'inversionistas/historial/pagos', component: HistorialPagosComponent },
    
    /*
     * Administradores
     */
    { path: 'admin/home', component: AdminHomeComponent },
    { path: 'admin/profile', component: ProfileComponent },
    { path: 'admin/createUser', component: CreateUserComponent },
    { path: 'admin/users', component: UsersComponent },
    { path: 'admin/createAccount', component: CreateAccountComponent },
    { path: 'admin/accounts', component: AccountsComponent },
    { path: 'admin/createTrading', component: CreateTradingComponent },
    { path: 'admin/createContract', component: CreateContractComponent },
    { path: 'admin/contracts', component: ContractsComponent },
    { path: 'admin/payments', component: PaymentsComponent },
    
  ];

@NgModule({
  imports: [
    RouterModule.forRoot( appRoutes ), /* encargado de leer las URLs del navegador, tambien si el usuario las escribe a mano */
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
