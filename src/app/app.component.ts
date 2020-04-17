import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';

import { DatabaseService } from './services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sqlite: SQLite, 
    private database: DatabaseService
  ) {
    this.initializeApp();

    this.platform.ready().then(()=> {
      splashScreen.hide();
      this.statusBar.styleDefault();
      this.createDatabase();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private createDatabase() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db) => {
        this.database.setDatabase(db);
        return this.database.createTable();
      })
      .then(() => {
        this.splashScreen.hide();
      })
      .catch(error => {
        console.log(error);
      })
  }
}
