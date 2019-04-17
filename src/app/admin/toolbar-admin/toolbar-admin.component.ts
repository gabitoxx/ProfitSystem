import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar-admin',
  templateUrl: './toolbar-admin.component.html',
  styleUrls: ['./toolbar-admin.component.css']
})
export class ToolbarAdminComponent implements OnInit {

  constructor(private router: Router){
    
  }

  ngOnInit() {
  }

  actualizarProfile(){
    this.router.navigate(["admin/profile"]);
  }
  
  goHome(){
    this.router.navigate(["admin/home"]);
  }
}