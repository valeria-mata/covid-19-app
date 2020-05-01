import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { sendEmail, validateCode } from '../constants/endpoints';

@Injectable({
  providedIn: 'root'
})
export class ActivationService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json' 
    })
  };

  sendEmail(email, phone): Observable<any> {
    const body = {
      email,
      phone
    };
    return this.http.post<any>(sendEmail, body, {headers: this.httpOptions.headers});
  }

  activateUser(email, phone, code): Observable<any> {
    const body = {
      email,
      phone,
      code
    }
    return this.http.post<any>(validateCode, body, {headers: this.httpOptions.headers});
  }


}
