import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { UserData } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  db: SQLiteObject = null;

  constructor() { }

  setDatabase(db: SQLiteObject) {
    if(this.db === null){
      this.db = db;
    }
  }

  createTable(){
    let sql = 'CREATE TABLE IF NOT EXISTS userInformation (name TEXT, phone TEXT, email TEXT)';
    return this.db.executeSql(sql, []);
  }

  selectAll(){
    let sql = 'SELECT * FROM userInformation';
    return this.db.executeSql(sql, []).then(res => {
      let users = [];
      for(let i = 0; i < res.rows.length; i++) {
        users.push(res.rows.item(i));
      }
      return Promise.resolve(users);
    }).catch(error => Promise.reject(error));
  }

  insertRow(user: UserData){
    let sql = 'INSERT INTO userInformation(name, phone, email) VALUES(?, ?, ?)';
    return this.db.executeSql(sql, [user.name, user.phone, user.email]);
  }

}
