import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { CustomMaterialModule } from './core/material.module';
import { HomeComponent } from './academia/home/home.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { ToolbarComponent } from './academia/toolbar/toolbar.component';
import { SidenavComponent } from './academia/sidenav/sidenav.component';
import { ToolbarAdminComponent } from './admin/toolbar-admin/toolbar-admin.component';
import { PerfilComponent } from './academia/perfil/perfil.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { CreateUserComponent } from './admin/create-user/create-user.component';
import { CreateAccountComponent } from './admin/create-account/create-account.component';
import { CreateTradingComponent } from './admin/create-trading/create-trading.component';
import { CreateContractComponent, AddInvestorModalDialog } from './admin/create-contract/create-contract.component';
import { RequestCredentialsComponent } from './request-credentials/request-credentials.component';
import { PaymentsComponent, PaymentPictureModalDialog } from './admin/payments/payments.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AdminHomeComponent,
    ToolbarComponent,
    SidenavComponent,
    ToolbarAdminComponent,
    PerfilComponent,
    ProfileComponent,
    CreateUserComponent,
    CreateAccountComponent,
    CreateTradingComponent,
    CreateContractComponent,
    RequestCredentialsComponent,
    AddInvestorModalDialog, PaymentPictureModalDialog,
    PaymentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule
  ],
  exports: [
    LoginComponent,
    CustomMaterialModule
  ],
  entryComponents: [
    AddInvestorModalDialog, PaymentPictureModalDialog
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
