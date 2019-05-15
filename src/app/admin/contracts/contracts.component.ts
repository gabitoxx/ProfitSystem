import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { UsersService } from 'src/app/services/users.service';
import { AccountService } from 'src/app/services/account.service';
import { ContractService } from 'src/app/services/contract.service';
import { CONSTANTES_UTIL } from 'src/app/shared/_utils/constantes-util';
import { IContract } from 'src/app/interfaces/IContract';
import { IUser } from 'src/app/interfaces/IUser';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css']
})
export class ContractsComponent implements OnInit {

  /** Snackbars configurations */
  configError: MatSnackBarConfig;
  configSuccess: MatSnackBarConfig;
  
  /** Listas */
  arrayContracts: IContract[];
  arrayUser: IUser[];

  constructor(
      private router: Router,
      public dialog: MatDialog,
      private snackBar: MatSnackBar,
      private accountService: AccountService,
      private userService: UsersService,
      private contractService: ContractService){

    this.loadUsers();
    this.loadContracts();

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
  }


  loadContracts() {
    this.contractService.getContracts().valueChanges().subscribe(
      ( data: IContract[] ) => {
        this.arrayContracts = data;
        console.log("arrayIDS",this.arrayContracts[0].inversionistasIds);
      }, (error) => {
        console.error('ContractsComponent.loadContracts() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }


  loadUsers() {
    this.userService.getUsers().valueChanges().subscribe(
      ( data: IUser[] ) => {
        this.arrayUser = data;
      }, (error) => {
        console.error('ContractsComponent.loadUsers() - error:', error);
        this.snackBar.open(CONSTANTES_UTIL.ERROR_FIREBASE_GET_ENTITIES, 'Ok', this.configError);
      }
    );
  }


  getUserName(gestorId:string){
    
    for ( var i = 0; i < this.arrayUser.length; i++ ){
      if ( this.arrayUser[i].id == gestorId ){
        return this.arrayUser[i].nombres + " " +  this.arrayUser[i].apellidos;
      }
    }
    return gestorId;
  }
}
