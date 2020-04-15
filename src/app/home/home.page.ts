import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AES256 } from '@ionic-native/aes-256/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userRegistration: FormGroup;
  private secureKey: string;
  private secureIV: string;

  constructor(private fb: FormBuilder, public router: Router, private alertCtrl: AlertController, private aes256: AES256) {

    this.generateSecureKeyAndIV();

    this.userRegistration = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      phone: [null, Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern('^[\\d]{10}$')])],
      email: ['', Validators.compose([Validators.maxLength(70), Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      accept: [false, Validators.compose([Validators.requiredTrue])],
      validateForm: [true, Validators.compose([Validators.requiredTrue])],
    });

  }

  async generateSecureKeyAndIV() {
    this.secureKey = await this.aes256.generateSecureKey('random password 12345'); // Returns a 32 bytes string
    this.secureIV = await this.aes256.generateSecureIV('random password 12345'); // Returns a 16 bytes string
  }

  sendInformation() {
    console.log("Se envía la información: " + this.userRegistration.controls.name.value + ", " + this.userRegistration.controls.phone.value + ", " + this.userRegistration.controls.email.value);
  
    this.aes256.encrypt(this.secureKey, this.secureIV, this.userRegistration.controls.name.value).then(res => console.log('Encrypted Data: ',res)).catch((error: any) => console.error(error));
  }

}
