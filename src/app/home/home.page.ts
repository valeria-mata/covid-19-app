import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { storageKeys } from './../constants/aes-keys';
import { UserData } from '../models/user';
import { DataService } from '../services/data.service';
import { ActivationService } from '../services/activation.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userRegistration: FormGroup;
  private secureKey: string;
  private secureIV: string;
  userPlain: UserData;
  private userEncrypted = {
    name: '',
    phone: '',
    email: ''
  };
  constantKeys = storageKeys;
  aux: any = 'respuesta';
  aux2: any;
  aux3: any;


  constructor(private fb: FormBuilder, public router: Router, private data: DataService, private activation: ActivationService,
              private aes256: AES256, private ble: BLE) {

    this.generateSecureKeyAndIV();

    this.userRegistration = this.fb.group({
      name: ['', Validators.compose([Validators.required])],
      phone: ['', Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern('^[\\d]{10}$')])],
      email: ['', Validators.compose([Validators.maxLength(70), Validators.required,
        Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$')])],
      accept: [false, Validators.compose([Validators.requiredTrue])],
      validateForm: [true, Validators.compose([Validators.requiredTrue])],
    });

  }

  async generateSecureKeyAndIV() {
    this.secureKey = await this.aes256.generateSecureKey('EstaEsMik3Yasjcis383ksqwertyuiop'); // Returns a 32 bytes string
    this.secureIV = await this.aes256.generateSecureIV('random password 12345'); // Returns a 16 bytes string
  }

  sendInformation() {

   this.userPlain = {
      name : this.userRegistration.controls.name.value,
      phone : this.userRegistration.controls.phone.value,
      email : this.userRegistration.controls.email.value 
    };

    this.data.setUserData(this.userPlain);

    /*this.aes256.encrypt(this.secureKey, this.secureIV, this.userRegistration.controls.name.value)
    .then(res =>
        this.aux = res
    )
    .catch(
      (error: any) => console.error(error)
    );

    this.aes256.encrypt(this.secureKey, this.secureIV, this.userRegistration.controls.phone.value)
    .then(res =>
        this.aux2 = res
    )
    .catch(
      (error: any) => console.error(error)
    );

    this.aes256.encrypt(this.secureKey, this.secureIV, this.userRegistration.controls.email.value)
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
    };*/
    
    this.router.navigate(['activation']);
  }


}
