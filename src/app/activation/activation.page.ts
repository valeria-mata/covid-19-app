import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
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

  userValidation: FormGroup;
  private keyIV: string = 'EstaEsMik3Yasjcis383ksqwertyuiop';
  private secureKey: string;
  private secureIV: string;
  userPlain: UserData;
  userEncrypted: UserData;
  aux:  any = '';
  aux2: any = '';
  

  constructor(private fb: FormBuilder, private router: Router, public alertController: AlertController, private aes256: AES256, 
              private data: DataService, private activation: ActivationService, private database: DatabaseService) {
            
      this.userValidation = this.fb.group({
        code: ['', Validators.compose([Validators.required, Validators.maxLength(6), Validators.pattern('^[\\d]{6}$')])],
      });

      this.generateSecureKeyAndIV();
  }

  ngOnInit() {
    this.userPlain = this.data.getUserData();
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
    this.secureKey = await this.aes256.generateSecureKey(this.keyIV); // Returns a 32 bytes string
    this.secureIV = await this.aes256.generateSecureIV(result); // Returns a 16 bytes string
  }

  validateActivationCode() {

    this.activation.activateUser(this.userPlain.email, this.userPlain.phone, this.userValidation.controls.code.value).subscribe(res => {
      if(res.code === 0) {
        this.encryptData();
      } else if(res.code === 1) {
        const header = 'Código incorrecto';
        const msg = 'Inténtalo nuevamente';
        this.presentAlert(header, msg);
      } else {
        const header = 'Código caducado';
        const msg = 'Ingresa nuevamente tus datos para volver a recibir un código';
        this.presentAlert(header, msg);
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
                email: res3,
                birthyear: this.userPlain.birthyear,
                regdate: this.userPlain.regdate
              };
              this.data.setUserData(this.userEncrypted);
              this.data.setUserString(`${this.userEncrypted.name}:${this.userEncrypted.phone}:${this.userEncrypted.email}:${this.userEncrypted.birthyear}`);
              this.sendToDatabase();
            });
        });
    });

    
  }

  sendToDatabase(){
      this.database.insertRow(this.userEncrypted).then(data => {
        this.router.navigate(['diagnose']);
      }, error => {
        alert(JSON.stringify(error));
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
