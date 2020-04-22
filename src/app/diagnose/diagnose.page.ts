import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DatabaseService } from '../services/database.service';
import { File } from '@ionic-native/file/ngx';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

declare var window: any;

@Component({
  selector: 'app-diagnose',
  templateUrl: './diagnose.page.html',
  styleUrls: ['./diagnose.page.scss'],
})
export class DiagnosePage implements OnInit {

  image: any;
  users: any;
  texto: any = '';
  address: any;
  serviceUUID: string = 'E20A39F4-73F5-4BC4-A12F-17D1AD07A961';
  characteristicUUID: string = '08590F7E-DB05-467E-8757-72F6FAEB13D4';

  constructor(private router: Router, private database: DatabaseService, private data: DataService, 
              private camera: Camera, private file: File, private diagnostic: Diagnostic, private bluetooth: BluetoothLE) { }
 
  ngOnInit() {
    const aux = {
      "request": true,
      "restoreKey": 'bluetoothleplugin'
    };
    this.bluetooth.initializePeripheral(aux).subscribe(res => {
      alert(JSON.stringify(res));
    })

    this.bluetooth.getAdapterInfo().then(res => {
      
      this.address = res.address;
      const params = {
        "address": this.address,
        "service": this.serviceUUID,
        "characteristic": this.characteristicUUID
      };
      alert(JSON.stringify(params));
      this.bluetooth.subscribe(params).subscribe(subs => {
        alert(JSON.stringify(subs));
      }, error => {
        alert(JSON.stringify(error));
      });
    });
  }

  takePicture() {
    this.database.selectAll().then( data => {
      this.database.setUsers(data);
      for(let i = 0; i < data.length; i++){
        const txt = `${data[i].name},${data[i].phone},${data[i].email}\n`;
        this.texto = txt;
        this.createFile(txt);
      }
      this.users = JSON.stringify(this.database.getUsers());
    }).catch(err => {
      this.database.setError(err);
    });
  }

  createFile(texto: string){
    this.file.checkFile(this.file.dataDirectory, 'data.txt')
      .then((exits) => {
        return this.writeFile(texto);
      }).catch(err => {
        return this.file.createFile(this.file.dataDirectory, 'data.txt', false)
          .then(FileEntry => this.writeFile(texto))
          .catch(err => console.log(err));
      });
  }

  writeFile(text: string) {
    this.file.writeFile(this.file.dataDirectory, 'data.txt', text,{replace: false, append: true });
  }

  readFile() {
    /*this.file.readAsDataURL(this.file.dataDirectory, 'data.txt')
      .then((data) => { 
        alert(data);
      });*/

      this.file.readAsText(this.file.dataDirectory, 'data.txt')
        .then((data) => {
          alert(data);
        })
    
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
     this.data.setPicture = this.image;
     this.router.navigate(['send-diagnose']);

    }, (err) => {
     // Handle error
    });
  }

  scan(){
    // this.diagnostic.switchToLocationSettings();
    
    
    this.diagnostic.isLocationAuthorized().then(aut => {
      if(aut === false){
        this.diagnostic.requestLocationAuthorization().then(loc => {
        });
      }
    })

    const params = {
      "scanMode": this.bluetooth.SCAN_MODE_LOW_LATENCY,
      "matchMode": this.bluetooth.MATCH_MODE_AGGRESSIVE,
      "matchNum": this.bluetooth.MATCH_NUM_MAX_ADVERTISEMENT,
      "callbackType": this.bluetooth.CALLBACK_TYPE_ALL_MATCHES,
    };

    let device = [];

    this.bluetooth.getAdapterInfo().then( res => {
      alert(JSON.stringify(res));
    })

    /*this.bluetooth.startScan(params).subscribe(res => {
      if(res.status === 'scanResult') {
        device.push(res);
      }
      
    });


    this.bluetooth.isScanning().then(res => {
      alert(JSON.stringify(res));
    });

    setTimeout(()=> {
      this.bluetooth.stopScan().then(resp => {
        alert(JSON.stringify(device));
      });
    }, 20000);*/
  }


}
