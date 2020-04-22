import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserData } from './../models/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private userRegistered: UserData;
  private picture: any;

  constructor() { }

  setUserData(userRegistered: UserData) {
    this.userRegistered = userRegistered;
  }

  getUserData() {
    return this.userRegistered;
  }

  setPicture(picture: any) {
    this.picture = picture;
  }

  getPicture() {
    return this.picture;
  }
}
