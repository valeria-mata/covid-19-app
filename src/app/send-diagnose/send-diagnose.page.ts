import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { File } from '@ionic-native/file/ngx';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-send-diagnose',
  templateUrl: './send-diagnose.page.html',
  styleUrls: ['./send-diagnose.page.scss'],
})
export class SendDiagnosePage implements OnInit {

  image: any;
  users: any;
  texto: any = '';
  zipFile: any;

  constructor(private router: Router, private database: DatabaseService, private data: DataService, private file: File) { 
    this.data.getPicture().subscribe(img => {
      this.image = img;
    });
  }

  ngOnInit() {
  }

  sendInfo() {

    this.generateTxt();

    //this.router.navigate(['share']);

  }

  generateTxt() {
    this.database.selectAll().then( data => {
      this.database.setUsers(data);
      for(let i = 0; i < data.length; i++){
        const txt = `${data[i].name},${data[i].phone},${data[i].email}\n`;
        this.texto = txt;
        this.createFile(txt);
      }
      this.users = JSON.stringify(this.database.getUsers());
      this.readFile();
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

    this.file.readAsText(this.file.dataDirectory, 'data.txt').then((data) => {
      alert(data);
      this.generateZip(this.file.dataDirectory, this.image)
    });
  }


  generateZip(txt, img){
    const zip = new JSZip();
    const folder = zip.folder('data');
    let blobPromise = fetch(txt).then(r => {
      if(r.status === 200) return r.blob() 
        return Promise.reject(new Error(r.statusText))
    });
    folder.file('data.txt', blobPromise);

    let blobPromise2 = fetch(img).then(r => {
      if(r.status === 200) return r.blob()
      return Promise.reject(new Error(r.statusText))
    })
    folder.file('diagnose.jpg', blobPromise2);

    zip.generateAsync({type:"blob"}).then(blob => {
      this.zipFile = blob
    }).catch(e => console.log(e));
  }

}
