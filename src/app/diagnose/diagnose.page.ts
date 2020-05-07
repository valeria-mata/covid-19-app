import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { UserData } from '../models/user';
import { DatabaseService } from '../services/database.service';
import { BluetoothService } from '../services/bluetooth.service';


declare var window: any;

@Component({
  selector: 'app-diagnose',
  templateUrl: './diagnose.page.html',
  styleUrls: ['./diagnose.page.scss'],
})
export class DiagnosePage implements OnInit {

  user : UserData;
  userString: string;
  userReceived: string;
  image: any;

  constructor(private router: Router, public alertController: AlertController, private backgroundMode: BackgroundMode, 
              private data: DataService, private database: DatabaseService, private bluetooth: BluetoothService,
              private camera: Camera) { }
 
  ngOnInit() {
    this.userString = this.data.getUserString();
    this.backgroundMode.setEnabled(true);
      
  }

  async presentAlert(header, msg) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  openCamera(){
    this.backgroundMode.disable();

    const options: CameraOptions = {
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA
    };
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
      this.image = window.Ionic.WebView.convertFileSrc( imageData );
      this.data.setPicture(this.image);
      this.router.navigate(['send-diagnose']);
    }, (err) => {
     alert(err);
    });
  }









  

  insertNewRow(){
    //this.userReceived = this.userString;

    let info = this.userReceived.split(':');
    let fecha = new Date().toString()
    let newUser = {
      name: info[0],
      phone: info[1],
      email: info[2],
      birthyear: info[2],
      regdate: fecha
    };
    this.database.insertRow(newUser);
  }

}
