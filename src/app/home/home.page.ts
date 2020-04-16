import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AES256 } from '@ionic-native/aes-256/ngx';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { storageKeys } from './../constants/aes-keys';
import { UserData, pairedList } from '../models/user';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  

  userRegistration: FormGroup;
  private secureKey: string;
  private secureIV: string;
  private userPlain: UserData;
  private userEncrypted: UserData;
  pairList : pairedList;
  listToogle : boolean = false;
  dataSend: string = '';
  pairedDeviceID: number = 0;

  constructor(private fb: FormBuilder, public router: Router, private data: DataService, 
              private aes256: AES256, private bluetoothSerial: BluetoothSerial,
              private alertCtrl: AlertController, private toastCtrl: ToastController) {


    this.checkBluetoothEnabled();

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
    this.userPlain.name = this.userRegistration.controls.name.value;
    this.userPlain.telephone = this.userRegistration.controls.phone.value;
    this.userPlain.email = this.userRegistration.controls.email.value;

    this.data.setUserData(this.userPlain);

    this.aes256.encrypt(this.secureKey, this.secureIV, this.userRegistration.controls.name.value)
    .then(res =>
        
        console.log('Encrypted Data: ',res)
    )
    .catch(
      (error: any) => console.error(error)
    );
  }

  checkBluetoothEnabled() {
      this.bluetoothSerial.isEnabled().then(success => {
        this.listDevices();
      }, error => {
        this.showError('Por favor, enciende tu bluetooth');
      });
  }

  listDevices() {
    this.bluetoothSerial.list().then(success => {
      this.pairList = success;
      this.listToogle = true;
    }, error =>{
      this.showError('Por favor, enciende tu bluetooth');
      this.listToogle = false;
    });
  }

  selectDevice() {
    let connectedDevice = this.pairList[this.pairedDeviceID];
    if(!connectedDevice.address) {
      this.showError('Elija un dispositivo para conectar');
      return;
    }

    let address = connectedDevice.adress;
    let name = connectedDevice.name;

    this.connect(address);
  }

  connect(address) {
    this.bluetoothSerial.connect(address).subscribe(success => {
      this.deviceConnected();
      this.showToast('Conectado');
    }, error => {
      this.showError('No se estableció conexión');
    });
  }

  deviceConnected() {
    this.bluetoothSerial.subscribe('\n').subscribe(success => {
      this.handleData(success);
      this.showToast('Se ha conectado correctamente');
    }, error => {
      this.showError(error);
    });
  }

  deviceDisconnected() {
    this.bluetoothSerial.disconnect();
    this.showToast('Dispositivo desconectado');
  }

  handleData(data) {
    this.showToast(data);
  }

  sendData(){
    this.dataSend = '\n';
    this.showToast(this.dataSend);
    this.bluetoothSerial.write(this.dataSend).then(success => {
      this.showToast(success);
    }, error => {
      this.showError(error);
    });
  }

  async showError(msg){
    let alert = await this.alertCtrl.create({
      header: 'Error',
      message: msg,
      buttons: ['Dismiss']
    });
    await alert.present();    
  }

  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000
    });

    await toast.present();
  }



  /*bluetooth() {
    // Write a string
    this.bluetoothSerial.write('hello world').then(res =>
      console.log(res), 
      
      );

    // Array of int or bytes
    this.bluetoothSerial.write([186, 220, 222]).then(res =>
      console.log(res),
  
    );

    // Typed Array
    var data = new Uint8Array(4);
    data[0] = 0x41;
    data[1] = 0x42;
    data[2] = 0x43;
    data[3] = 0x44;
    this.bluetoothSerial.write(data).then(res =>
      console.log(res),
  
    );

    // Array Buffer
    this.bluetoothSerial.write(data.buffer).then(res =>
      console.log(res),
  
    );
  }*/

}
