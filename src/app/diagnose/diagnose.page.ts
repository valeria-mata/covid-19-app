import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DatabaseService } from '../services/database.service';
import { File } from '@ionic-native/file/ngx';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

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

  constructor(private router: Router, private camera: Camera, private database: DatabaseService, private data: DataService, private file: File) { }
 
  ngOnInit() {
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


}
