import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { CONSTANTES_UTIL } from '../shared/_utils/constantes-util';
import { SessionService } from '../services/session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
      private auth: AuthService,
      private router: Router){
    
  }

  canActivate(
      next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
      /* everybody can in */
      //return true;

      return this.auth.getStatus().pipe(
        // validar del objeto su campo 'status'
        map( (status) => {
          console.log("AUTH:", status)
          if ( status ) {
            return true;

          } else {
            this.router.navigate(['login']);
            return false;
          }
        })
      );
  }


}
