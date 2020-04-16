import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserData } from './../models/user';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private userRegistered = new Subject<UserData>();

  constructor() { }

  setUserData(userRegistered: UserData) {
    this.userRegistered.next(userRegistered);
  }

  getUserData() {
    return this.userRegistered.asObservable();
  }
}
