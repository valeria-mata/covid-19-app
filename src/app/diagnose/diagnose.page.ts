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
    //this.userString = `${this.user.name}:${this.user.phone}:${this.user.email}:${this.user.birthyear}`;
    
    alert(this.userString);
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
    this.userReceived = this.userString;
    
    alert(this.userString);

    let part = this.userReceived.indexOf(':', 0);
    alert('indice 1: ' + part);
    let name = this.userReceived.substr(0,part-1);
    alert('name: ' + name);
    let part2 = this.userReceived.indexOf(':', part+1);
    alert('indice 2: ' + part2);
    let phone = this.userReceived.substr(part+1,part2-1);
    alert('phone: ' + phone);
    let part3 = this.userReceived.indexOf(':', part2+1);
    alert('indice 3: ' + part3);
    let email = this.userReceived.substr(part2+1,part3-1);
    alert('email: ' + email);
    let birthyear = this.userReceived.substr(part3+1,this.userReceived.length);
    alert('birthyear: ' + birthyear);




    alert(this.userReceived);


    let fecha = new Date().toString()
    let newUser = {
      name: '',
      phone: '',
      email: '',
      birthyear: '',
      regdate: fecha
    };

    //this.database.insertRow(newUser);
  }

  
  test(){
    this.insertNewRow();
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
