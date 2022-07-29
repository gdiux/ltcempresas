import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

// MODELS
import { Abonado } from '../models/abonado.model';

// INTERFACE
import { LoginForm } from '../interfaces/login-form.interface';
import { LoadUsers } from '../interfaces/load-users.interface';

// ENVIRONMENT
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public user!: Abonado;

  constructor(  private http: HttpClient,
                private router: Router) { }


  /** ================================================================
   *   GET TOKEN
  ==================================================================== */
  get token():string {
    return localStorage.getItem('token') || '';
  }

  /** ================================================================
   *   GET HEADERS
  ==================================================================== */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /** ================================================================
   *   LOGOUT
  ==================================================================== */
  logout(){
    
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');

  }

  /** ================================================================
   *  LOGIN
  ==================================================================== */
  login( formData: LoginForm ){
    
    return this.http.post(`${base_url}/login`, formData)
                      .pipe(
                        tap( (resp: any) => {
                          localStorage.setItem('token', resp.token);
                        }),
                        catchError( error => of(false) )
                      );
  }

  /** ================================================================
   *   VALIDATE TOKEN OR RENEW TOKEN
  ==================================================================== */
  validateToken():Observable<boolean>{
    const token = localStorage.getItem('token') || '';
    
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (resp: any) => {
        
        const { usuario, name, aid, password, clients, valid, status, fecha} = resp.abonado;

        this.user = new Abonado( usuario, name, aid, '',[], valid, status, fecha);           

        localStorage.setItem('token', resp.token);

      }),
      map( resp => true ),
      catchError( error => of(false) )
    );

  }

  /** ================================================================
   *  LOAD USER BY ID /user/:id'
  ==================================================================== */
  loadUserId(id: string){
    return this.http.get<{ok: boolean, user: Abonado}>(`${base_url}/abonados/user/${id}`, this.headers);
  }


  /** ================================================================
   *  UPDATE USER
  ==================================================================== */
  updateUser( formData: any, id: string ){
    return this.http.put< { user: Abonado, ok: boolean } >(`${base_url}/abonados/${id}`, formData, this.headers);
  }




  // FIN DE LA CLASE
}
