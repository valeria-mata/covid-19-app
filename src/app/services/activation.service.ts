import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { sendEmail, validateCode } from '../constants/endpoints';
import { userActivation, UserData } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ActivationService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //Añadir header de text/plain
    })
  };

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  sendEmail(email, phone): Observable<any> {
    const body = {
      email,
      phone
    };
    console.log(body);
    return this.http.post<any>(sendEmail, body, {headers: this.httpOptions.headers});
  }

  activateUser(email, phone, code): Observable<any> {
    return this.http.post<any>(validateCode, JSON.stringify(email, phone, code), this.httpOptions);
  }

  public sendTest(userData: any) {
    console.log(userData);
    const url = 'https://c5.therobox.io/api/covid';
    const body = userData;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
    return this.http.post(url, body, {headers: httpOptions.headers});
  }
}
