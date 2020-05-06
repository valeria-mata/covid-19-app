import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { File } from '@ionic-native/file/ngx';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { ZipService } from '../services/zip.service';
import { Crypt } from 'hybrid-crypto-js';
import { HttpClient } from '@angular/common/http';
import { UploadService } from '../services/upload.service';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

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
  finalZip: any;
  image: any;

  private privateKey = '../../assets/keys/private.pem';
  private publicKey = '../../assets/keys/public-ios.pem';

  constructor(private router: Router, private file: File, private aes256: AES256, private http: HttpClient, public alertController: AlertController, public loadingController: LoadingController,
              private database: DatabaseService, private data: DataService, private zipserv: ZipService, private upload: UploadService) { 
                this.generateSecureKeyAndIV();
  }

  ngOnInit() {
    this.image = this.data.getPicture();
  }

  async presentAlert(header, msg) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  generateTxt() {
    this.database.selectAll().then( data => {
      this.database.setUsers(data);
      for(let i = 0; i < data.length; i++){
        const txt = `${data[i].name},${data[i].phone},${data[i].email},${data[i].birthyear},${data[i].regdate}\n`;
        this.createFile(txt);
      }
      //this.readFile();

      const text = `${this.file.dataDirectory}data.txt`;
      const img = this.image;
      const content = [];
      content.push(text);
      content.push(img);
      this.zipserv.generateZip('data', content).then(res => {
        this.encryptZipAndKeys(res);
      }, err => {
        console.log(err);
      });
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
      this.zipEncrypted = res;
      this.http.get(this.publicKey, {responseType: 'text'})
        .subscribe(data => {
          let crypt = new Crypt();
          this.encryptedKey = crypt.encrypt(data, this.secureKey);
          this.encryptedIV = crypt.encrypt(data, this.secureIV);
          this.generateFinalZip();
        });
    });
  }

  generateFinalZip(){
    const zipEnc = this.zipEncrypted;
    const keyEnc = this.encryptedKey;
    const ivEnc = this.encryptedIV;
    const content = [];
    content.push(zipEnc);
    content.push(keyEnc);
    content.push(ivEnc);
    this.zipserv.generateZip('info', content).then(res => {
        this.finalZip = res;
        this.upload.sendEmail(this.finalZip).subscribe(res => {
          this.router.navigate(['share']);
        }, r => {
          this.presentAlert('Error', 'No se pudo enviar tu información, inténtalo nuevamente.');
        });
    }, err => {
        console.log(err);
      });
  }



  readFile() {
    /* Función de prueba para revisar txt generado */
    this.file.readAsText(this.file.dataDirectory, 'data.txt').then((data) => {
      const text = `${this.file.dataDirectory}data.txt`;
      const img = this.image;
      const content = [];
      content.push(text);
      content.push(img);
      this.zipserv.generateZip('data', content).then(res => {

      }, err => {
        console.log(err);
      })
    });
  }
}
