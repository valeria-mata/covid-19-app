import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { UserData } from '../models/user';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  db: SQLiteObject = null;
  users: any;
  error: any;

  constructor(private porter: SQLitePorter) { }

  setUsers(users) {
    this.users = users
    return this.users;
  }

  setError(error) {
    this.error = error;
    return this.error;
  }

  getError(){
    return this.error;
  }

  getUsers() {
    return this.users;
  }

  setDatabase(db: SQLiteObject) {
    if(this.db === null){
      this.db = db;
    }
  }

  createTable(dbase: SQLiteObject){
    let sql = 'CREATE TABLE IF NOT EXISTS userInformation (name TEXT, phone TEXT, email TEXT)';
    return this.porter.importSqlToDb(dbase, sql);
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
