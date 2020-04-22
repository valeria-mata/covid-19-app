import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { bindNodeCallback } from 'rxjs';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { storageKeys } from './../constants/aes-keys';
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

  private secureKey: string;
  private secureIV: string;
  userPlain: UserData;
  userEncrypted: UserData;
  constantKeys = storageKeys;
  aux:  any = '';
  aux2: any = '';
  variable: any;

  smsCode: any = { first: '', second: '', third: '', fourth: '', fifth: '', sixth: '' };
  code = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]));

  constructor(private router: Router, private aes256: AES256, private data: DataService, 
              private activation: ActivationService, private database: DatabaseService) {
    this.generateSecureKeyAndIV();
   }

  ngOnInit() {
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

  async generateSecureKeyAndIV() {
    this.secureKey = await this.aes256.generateSecureKey('EstaEsMik3Yasjcis383ksqwertyuiop'); // Returns a 32 bytes string
    this.secureIV = await this.aes256.generateSecureIV('random password 12345'); // Returns a 16 bytes string
  }

  validateActivationCode() {

    //añadir aquí la petición al endpoint para saber si es correcto el código, si es así llamar a 
    //la función validationSuccess, si no, enviar mensaje de error
    this.validationSuccess();
  }

  validationSuccess(){
    console.log('Validacion');
    this.userPlain = this.data.getUserData();
    
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
              this.sendBase();
            });
        });
    });
  }

  sendBase() {
      //this.variable = JSON.stringify(this.userEncrypted);
      this.database.insertRow(this.userEncrypted).then(data => {
        console.log(data);
        this.router.navigate(['diagnose']);
      }, error => {
        console.log(error);
      });

  }

  sendAgain(){
    this.router.navigate(['home']);
  }

}
