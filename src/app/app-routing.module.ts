import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
  /*  { path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard] }, */
    { path: 'login', component: LoginComponent },
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
