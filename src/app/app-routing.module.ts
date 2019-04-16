import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './academia/home/home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';

const appRoutes: Routes = [
  /*  { path: 'home', component: HomeComponent, canActivate: [AuthenticationGuard] }, */
    { path: '',      component: LoginComponent },  
    { path: 'login', component: LoginComponent },
    { path: 'academia/home', component: HomeComponent },
    { path: 'admin/home', component: AdminHomeComponent },
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
