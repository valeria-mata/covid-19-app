import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { File } from '@ionic-native/file/ngx';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { ZipService } from '../services/zip.service';
import * as JSZip from 'jszip';
//import * as cryptico from 'cryptico';

@Component({
  selector: 'app-send-diagnose',
  templateUrl: './send-diagnose.page.html',
  styleUrls: ['./send-diagnose.page.scss'],
})
export class SendDiagnosePage implements OnInit {

  private secureKey: string;
  private secureIV: string;
  private encryptedKey: string;
  private encryptedIV: string;
  zipEncrypted: any;
  image: any;
  users: any;
  texto: any = '';

  private privateKey = '../../assets/keys/private.pem';
  private publicKey = '../../assets/keys/public-ios.pem';

  constructor(private router: Router, private database: DatabaseService, private data: DataService, private zipserv: ZipService,
              private file: File, private aes256: AES256) { 
                this.generateSecureKeyAndIV();
  }

  ngOnInit() {
    this.image = this.data.getPicture();
  }

  sendInfo() {

    this.generateTxt();

    //this.router.navigate(['share']);

  }

  generateTxt() {
    this.database.selectAll().then( data => {
      this.database.setUsers(data);
      for(let i = 0; i < data.length; i++){
        const txt = `${data[i].name},${data[i].phone},${data[i].email},${data[i].birthyear},${data[i].regdate}\n`;
        this.createFile(txt);
      }
      this.readFile();
      //this.generateZip(this.file.dataDirectory + 'data.txt', this.image);
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
    /* Función de prueba para revisar txt generado */
    this.file.readAsText(this.file.dataDirectory, 'data.txt').then((data) => {
      alert('TXT GENERADO: '+ data);
      const text = `${this.file.dataDirectory}data.txt`;
      const img = this.image;
      const content = {
        text,
        img
      }
      alert(JSON.stringify(content));
      this.zipserv.generateZip('data',content);

      //this.generateZip(this.file.dataDirectory + 'data.txt', this.image);
    });
  }

  generateZip(txt, img){
    const zip = new JSZip();
    const folder = zip.folder('data');
    folder.file(txt);
    folder.file(img);

    zip.generateAsync({type: "uint8array"}).then(function (u8) {
      this.encryptZipAndKeys(u8);
    }, err => {
      alert(err);
    });
  }

  async generateSecureKeyAndIV() {
    let resultIV = '';
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for(let i = 0; i < 16; i++){
      resultIV += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    for(let i = 0; i < 32; i++){
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.secureKey = await this.aes256.generateSecureKey(result); // Returns a 32 bytes string
    this.secureIV = await this.aes256.generateSecureIV(resultIV); // Returns a 16 bytes string
  }

  encryptZipAndKeys(zip){
    this.aes256.encrypt(this.secureKey, this.secureIV, zip).then(res => {
      alert('ZIP ENCRIPTADO'+ res);  
      this.zipEncrypted = res;
      
      alert('LLAVE AES: '+ this.secureKey);
     // this.encryptedKey = cryptico.encrypt(this.secureKey, this.publicKey);
     // alert(this.encryptedKey);
    });

    

  }

}
