import { Injectable } from '@angular/core';
import { HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { uploadData } from '../constants/endpoints';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json' 
    })
  };

  sendEmail(finalZip): Observable<any> {
    const body = {
      finalZip
    };
    console.log(this.httpOptions.headers);
    return this.http.post<any>(uploadData, body, {headers: this.httpOptions.headers});
  }
}
