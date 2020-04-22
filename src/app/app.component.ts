import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { DatabaseService } from './services/database.service';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { BluetoothService } from './services/bluetooth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private dbase: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sqlite: SQLite, 
    private porter: SQLitePorter,
    private bluetooth: BluetoothLE,
    private database: DatabaseService,
    private bleServ: BluetoothService,
    private router: Router
  ) {
    this.initializeApp();

    this.platform.ready().then(()=> {
      this.bleServ.initBluetooth().subscribe((res) => {
        if(res.status === 'disabled'){
          const r = this.bluetooth.enable();
          this.bluetooth.initialize().subscribe((ini) => {
            this.bleServ.setBluetoothStatus(ini);
            this.initDB();
          })
        } else {
          this.bleServ.setBluetoothStatus(res);
          this.initDB();
        } 
      })
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  initDB() {
    this.sqlite.create(
      {name: 'CovidApp.db', location: 'default'})
      .then((db: SQLiteObject) => {
        this.dbase = db;
        this.database.setDatabase(this.dbase);
        this.database.createTable(this.dbase).then((data) => {
          this.dbReady.next(true);
          this.database.setUsers(data);
          this.database.selectAll().then( data => {
            this.database.setUsers(data);
            if(data.length > 0) {
              this.router.navigate(['diagnose']);
            }
          }).catch(err => {
            this.database.setError(err);
          });
        });
        console.log(this.dbase);
      });
  }
}
