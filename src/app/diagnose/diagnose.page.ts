import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { AlertController } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { UserData } from '../models/user';
import { DatabaseService } from '../services/database.service';


declare var window: any;

@Component({
  selector: 'app-diagnose',
  templateUrl: './diagnose.page.html',
  styleUrls: ['./diagnose.page.scss'],
})
export class DiagnosePage implements OnInit {

  user : UserData;
  interval: any;

  image: any;
  users: any;
  texto: any = '';
  address: any;
  serviceUUID: string = 'E20A39F4-73F5-4BC4-A12F-17D1AD07A961';
  characteristicUUID: string = '08590F7E-DB05-467E-8757-72F6FAEB13D4';

  constructor(private router: Router, public alertController: AlertController, private backgroundMode: BackgroundMode, 
              private data: DataService, private database: DatabaseService,
              private camera: Camera, private bluetooth: BluetoothLE) { }
 
  ngOnInit() {
    this.user = this.data.getUserData();
    this.backgroundMode.setEnabled(true);
      
    this.interval = setInterval(() =>
      this.insertNewRow()
    , 5000);
     
    
      
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
    console.log('agregar fila');
    let fecha = new Date;
    let testing = {
      name: this.user.name,
      phone: this.user.phone,
      email: this.user.email,
      birthyear: this.user.birthyear,
      regdate: fecha
    };

    this.database.insertRow(testing);
  }

  
  test(){
    clearInterval(this.interval);
    this.database.selectAll().then( data => {
      alert(JSON.stringify(data));
    });
    let flag = this.backgroundMode.isActive();
    alert(flag);
    if(flag){
      this.backgroundMode.disable();
    }
    

  }




}
