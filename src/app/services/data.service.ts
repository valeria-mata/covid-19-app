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

  constructor() { }

  setUserData(userRegistered: UserData) {
    this.userRegistered = userRegistered;
  }

  getUserData() {
    return this.userRegistered;
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
