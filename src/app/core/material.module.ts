import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatDialogModule, MatInputModule, MatTableModule,
  MatToolbarModule, MatMenuModule,MatIconModule, MatProgressSpinnerModule, 
  MatFormFieldModule, MatRippleModule,
  MatExpansionModule, MatOptionModule, MatSelectModule, MatListModule, 
  MatSnackBarModule, MatSidenavModule,
  MatRadioModule,
  MatFormFieldControl, 
  MatDatepickerModule, MatNativeDateModule,
  MAT_DIALOG_DATA,
  MatSlideToggleModule,
  MatTooltipModule
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
    MatExpansionModule,
    MatSelectModule, 
    MatListModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatRadioModule,
    MatOptionModule,
    MatDatepickerModule, MatNativeDateModule,
    MatSlideToggleModule,
    MatTooltipModule
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
    MatListModule,
    MatRadioModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatSlideToggleModule,
    MatTooltipModule
  ],
})
export class CustomMaterialModule { }