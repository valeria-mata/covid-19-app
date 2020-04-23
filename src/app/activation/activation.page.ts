import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { UserData } from '../models/user';
import { DataService } from '../services/data.service';
import { ActivationService } from '../services/activation.service';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.page.html',
  styleUrls: ['./activation.page.scss'],
})

export class ActivationPage implements OnInit {

  @ViewChild('field1', { static: false }) field1;
  @ViewChild('field2', { static: false }) field2;
  @ViewChild('field3', { static: false }) field3;
  @ViewChild('field4', { static: false }) field4;
  @ViewChild('field5', { static: false }) field5;
  @ViewChild('field6', { static: false }) field6;

  private keyIV: string = 'EstaEsMik3Yasjcis383ksqwertyuiop';
  private secureKey: string;
  private secureIV: string;
  userPlain: UserData;
  userEncrypted: UserData;
  aux:  any = '';
  aux2: any = '';

  smsCode: any = { first: '', second: '', third: '', fourth: '', fifth: '', sixth: '' };
  code = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]));

  constructor(private router: Router, public alertController: AlertController, private aes256: AES256, 
              private data: DataService, private activation: ActivationService, private database: DatabaseService) {
      this.generateSecureKeyAndIV();
  }

  ngOnInit() {
    this.userPlain = this.data.getUserData();
  }

  generateCode() {
   this.code.setValue(`${this.smsCode.first}${this.smsCode.second}${this.smsCode.third}${this.smsCode.fourth}${this.smsCode.fifth}${this.smsCode.sixth}`);
  }

  eventIonChange(next, before, event) {
    const valueInput = event.target.value;
    if (valueInput === '') {
      switch (before) {
        case 1:
          this.field1.setFocus();
          break;
        case 2:
          this.field2.setFocus();
          break;
        case 3:
          this.field3.setFocus();
          break;
        case 4:
          this.field4.setFocus();
          break;
        case 5:
          this.field4.setFocus();
          break;
      }
    } else {
      switch (next) {
        case 2:
          this.field2.setFocus();
          break;
        case 3:
          this.field3.setFocus();
          break;
        case 4:
          this.field4.setFocus();
          break;
        case 5:
          this.field5.setFocus();
          break;
        case 6:
          this.field6.setFocus();
          break;
      }
    }
  }

  async presentAlert(header, msg) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async generateSecureKeyAndIV() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for(let i = 0; i < 16; i++){
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    this.data.setAESKey(result);
    this.secureKey = await this.aes256.generateSecureKey(this.keyIV); // Returns a 32 bytes string
    this.secureIV = await this.aes256.generateSecureIV(result); // Returns a 16 bytes string
  }

  validateActivationCode() {

    this.activation.activateUser(this.userPlain.email, this.userPlain.phone, this.code.value).subscribe(res => {
      console.log(res);
      if(res.code === 0) {
        this.encryptData();
      } else if(res.code === 1) {
        const header = 'Código incorrecto';
        const msg = 'Inténtalo nuevamente';
        this.presentAlert(header, msg);
        console.log('Código incorrecto');
      } else {
        const header = 'Código caducado';
        const msg = 'Ingresa nuevamente tus datos para volver a recibir un código';
        this.presentAlert(header, msg);
        console.log('Código expirado');
        this.sendAgain();
      }
    }); 
  }

  encryptData(){
    this.aes256.encrypt(this.secureKey, this.secureIV, this.userPlain.name)
    .then(res => {
      this.aux = res;
      this.aes256.encrypt(this.secureKey, this.secureIV, this.userPlain.phone)
        .then(res2 => {
          this.aux2 = res2;
          this.aes256.encrypt(this.secureKey, this.secureIV, this.userPlain.email)
            .then(res3 => {
              this.userEncrypted = {
                name: this.aux,
                phone: this.aux2,
                email: res3
              };
              this.data.setUserData(this.userEncrypted);
              this.sendToDatabase();
            });
        });
    });
  }

  sendToDatabase(){
      this.database.insertRow(this.userEncrypted).then(data => {
        console.log(data);
        this.router.navigate(['diagnose']);
      }, error => {
        console.log(error);
      });

  }

  sendAgain(){
    this.activation.sendEmail(this.userPlain.email, this.userPlain.phone).subscribe(res => {
      const header = 'Código reenviado';
        const msg = 'Te llegará un código nuevo para activar tu cuenta.';
        this.presentAlert(header, msg);
    })
  }

}
