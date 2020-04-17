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
  aux: any = '1';
  aux2: any = '2';
  aux3: any = '3';

  smsCode: any = { first: '', second: '', third: '', fourth: '', fifth: '', sixth: '' };
  code = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  constructor(private router: Router, private aes256: AES256, private data: DataService, private activation: ActivationService, private database: DatabaseService) {
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
    this.validationSuccess();
    this.database.insertRow(this.userEncrypted).then(data => {
      console.log(data);
      this.router.navigate(['diagnose']);
    }, error => {
      console.log(error);
    });
  }

  validationSuccess(){
    console.log('Validacion');
    this.userPlain = this.data.getUserData();
    
    this.aes256.encrypt(this.secureKey, this.secureIV, this.userPlain.name)
    .then(res =>
        this.aux = res
    )
    .catch(
      (error: any) => console.error(error)
    );

    this.aes256.encrypt(this.secureKey, this.secureIV, this.userPlain.phone)
    .then(res =>
        this.aux2 = res
    )
    .catch(
      (error: any) => console.error(error)
    );

    this.aes256.encrypt(this.secureKey, this.secureIV, this.userPlain.email)
    .then(res =>
        this.aux3 = res
    )
    .catch(
      (error: any) => console.error(error)
    );
      
    this.userEncrypted = {
      name: this.aux,
      phone: this.aux2,
      email: this.aux3
    };
    this.data.setUserData(this.userEncrypted);
  }

  sendAgain(){
    this.router.navigate(['home']);
  }

}
