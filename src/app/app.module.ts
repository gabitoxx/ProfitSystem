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
import { PagoComponent } from './academia/pago/pago.component';

/** Firebase  */
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { UsersService } from './services/users.service';
import { UsersComponent } from './admin/users/users.component';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';

export const firebaseConfig = {
  apiKey: "AIzaSyBrD2fJ8540IMWI5p-FmL_7Mik_fvZnJns",
  authDomain: "profit-t4k3rs.firebaseapp.com",
  databaseURL: "https://profit-t4k3rs.firebaseio.com",
  projectId: "profit-t4k3rs",
  storageBucket: "profit-t4k3rs.appspot.com",
  messagingSenderId: "624618685545"
};

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
    PaymentsComponent,
    PagoComponent,
    UsersComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    AngularFireModule.initializeApp( firebaseConfig ), // imports firebase/app needed for everything
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features
    AngularFireDatabaseModule,
  ],
  exports: [
    LoginComponent,
    CustomMaterialModule
  ],
  entryComponents: [
    AddInvestorModalDialog, PaymentPictureModalDialog,
    ConfirmationDialogComponent, // reutilizable confirm dialog
  ],
  providers: [
    UsersService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
