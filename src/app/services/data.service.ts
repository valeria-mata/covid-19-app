import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserData } from './../models/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private userRegistered: UserData;
  private picture: any;
  private key: string;
  private userString: string;

  constructor() { }

  setUserData(userRegistered: UserData) {
    this.userRegistered = userRegistered;
  }

  getUserData() {
    return this.userRegistered;
  }

  setUserString(userString: string){
    this.userString = userString;
  }

  getUserString() {
    return this.userString;
  }

  setAESKey(key: string) {
    this.key = key;
  }

  getAESKey() {
    return this.key;
  }

  setPicture(picture: any) {
    this.picture = picture;
  }

  getPicture() {
    return this.picture;
  }

}
