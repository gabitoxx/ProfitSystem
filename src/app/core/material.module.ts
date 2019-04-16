import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, 
  MatFormFieldModule, MatRippleModule,
  MatExpansionModule, MatOptionModule, MatSelectModule, MatListModule, 
  MatSnackBarModule, MatSidenavModule,
  MatNativeDateModule, 
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule, 
    MatToolbarModule,
    MatButtonModule, 
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatRippleModule,
    MatExpansionModule, MatOptionModule, MatSelectModule, 
    MatListModule, MatSnackBarModule,
    MatSidenavModule
  ],
  exports: [
    CommonModule,
    MatToolbarModule, 
    MatButtonModule, 
    MatCardModule, 
    MatInputModule, 
    MatDialogModule, 
    MatTableModule, 
    MatMenuModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule
  ],
})
export class CustomMaterialModule { }