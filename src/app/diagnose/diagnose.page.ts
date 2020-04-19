import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DatabaseService } from '../services/database.service';
import { File } from '@ionic-native/file/ngx';

declare var window: any;

@Component({
  selector: 'app-diagnose',
  templateUrl: './diagnose.page.html',
  styleUrls: ['./diagnose.page.scss'],
})
export class DiagnosePage implements OnInit {

  image: any;
  users: any;
  texto: any;

  constructor(private camera: Camera, private database: DatabaseService, private file: File) { }

  ngOnInit() {
  }

  takePicture() {
    
    this.database.selectAll().then( data => {
      this.database.setUsers(data);
      for(let i = 0; i < data.length; i++){
        const txt = `${data[i].name},${data[i].phone},${data[i].email}`;
        this.writeFile(txt);
      }
      this.users = JSON.stringify(this.database.getUsers());
    }).catch(err => {
      this.database.setError(err);
    });
  }

  writeFile(texto: any){
    this.texto = texto;
  }

  takePictureOG() {
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
     console.log(this.image);

    }, (err) => {
     // Handle error
    });
  }

}
