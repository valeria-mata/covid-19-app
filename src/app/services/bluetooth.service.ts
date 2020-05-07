import { Injectable } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { filter } from 'rxjs/operators';
import { Platform, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  service = 'E20A39F4-73F5-4BC4-A12F-17D1AD07A961';
  characteristic = '08590F7E-DB05-467E-8757-72F6FAEB13D4';
  device: any;

  constructor(private bluetoothle: BluetoothLE, public plt: Platform, public alertController: AlertController) {
    this.plt.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
      this.init();
    });
   }

   async presentAlert(msg: string) {
    const alert = await this.alertController.create({
      header: 'Valor',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  init() {
    if (this.bluetoothle.hasPermission) {
      this.bluetoothle.requestPermission().then(permission => {
        if (permission) {
          this.initCentral();
          this.initPeri();
        }
      }).catch(err => {
        console.log(err);
      });
    } else {
      this.initPeri();
    }
  }

  initCentral() {
    let params = {
      "request": true,
      "statusReceiver": true,
      "restoreKey": "covid-19"
    };
    this.bluetoothle.initialize(params).subscribe(status => {
      console.log(status);
    }, err => {
      console.log(err);
    });
  }

  initPeri() {
    let params = {
      "request": true,
      "restoreKey": "covid-19"
    };
    this.bluetoothle.initializePeripheral(params).subscribe(res => {
      console.log('initializePeripheral', res);
      if (res.status == 'enabled') {
        this.initService();
      }
      if (res.status == 'readRequested') {
        this.bluetoothle.respond(res).then(val => {
          console.log('respond read', val);
        }).catch(err => console.log(err));
      }
      if (res.status == 'writeRequested') {
        this.bluetoothle.respond(res).then(val => {
          console.log('respond write', val);
          let bytes = this.bluetoothle.encodedStringToBytes(res.value);
          let str = this.bluetoothle.bytesToString(bytes);
          this.presentAlert(str);
        }).catch(err => console.log(err));
      }
    }, err => {
      console.log(err);
    });
  }

  initService() {
    var params = {
      service: this.service,
      characteristics: [
        {
          uuid: this.characteristic,
          permissions: {
            read: true,
            write: true,
            writeWithoutResponse: true
            //readEncryptionRequired: true,
            //writeEncryptionRequired: true,
          },
          properties: {
            read: true,
            writeWithoutResponse: true,
            write: true,
            notify: true,
            indicate: true,
            //authenticatedSignedWrites: true,
            //notifyEncryptionRequired: true,
            //indicateEncryptionRequired: true,
          }
        }
      ]
    };
    this.bluetoothle.addService(params).then(res => {
      console.log(res);
      !this.bluetoothle.isAdvertising().then(val => {
        if (!val) {
          this.startAdv();
        }
      })
    }, err => {
      console.log(err);
    })
  }

  scan() {
    let params = {
      services: [
        this.service
      ],
      allowDuplicates: false,
      scanMode: this.bluetoothle.SCAN_MODE_LOW_POWER,
      matchMode: this.bluetoothle.MATCH_MODE_AGGRESSIVE,
      matchNum: this.bluetoothle.MATCH_NUM_MAX_ADVERTISEMENT,
      callbackType: this.bluetoothle.CALLBACK_TYPE_ALL_MATCHES,
      isConnectable: true
    };
    this.bluetoothle.startScan(params).pipe(
      filter(val => {
        var valid = false
        if (val.name) {
          valid = true
        }
        return valid;
      })
    ).subscribe(status => {
      console.log(status);
      this.device = status;
      this.scanOff();
    }, err => {
      console.log(err);
    });
  }

  scanOff() {
    this.bluetoothle.stopScan().then(status => {
      console.log(status);
    }).catch(err => console.log(err));
  }

  discover() {
    if (this.device) {
      this.bluetoothle.discover(this.device).then(val => {
        console.log(val);
      }).catch(err => console.log(err));
    }
  }

  connect() {
    if (this.device) {
      let params = {
        address: this.device.address
      };
      this.bluetoothle.connect(params).subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
    }
  }

  subsChar() {
    let paramsCharac = {
      "address": this.device.address,
      "service": this.service,
      "characteristic": this.characteristic,
    };
    this.bluetoothle.subscribe(paramsCharac).subscribe(res => {
      console.log('CHARACTERISTICS!!!');
      console.log(res);
    }, err => {
      console.log(err);
    });
  }

  reconnect() {
    if (this.device) {
      let params = {
        address: this.device.address
      };
      this.bluetoothle.reconnect(params).subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
    }
  }

  disconnect() {
    if (this.device) {
      let params = {
        address: this.device.address
      };
      this.bluetoothle.disconnect(params).then(res => {
        console.log(res);
        this.bluetoothle.close(params).then(r => {
          console.log(r);
        }).catch(e => console.log(e));
      }).catch(err => console.log(err));
    }
  }

  charact() {
    if (this.device) {
      let params = {
        "address": this.device.address,
        "service": this.service,
        "characteristics": [
          this.characteristic
        ]
      };
      this.bluetoothle.characteristics(params).then(val => {
        console.log(val);
      }).catch(err => console.log(err));
    }
  }

  startAdv() {
    let params = {
      service: this.service,
      services: [
        this.service
      ],
      connectable: true,
      timeout: 0,
      includeDeviceName: false
    };
    this.bluetoothle.startAdvertising(params).then(status => {
      console.log('startAdvertising', status);
    }).catch(err => console.log(err));
  }

  stopAdv() {
    this.bluetoothle.stopAdvertising().then(status => {
      console.log(status);
    }).catch(err => console.log(err));
  }

  bond() {
    if (this.device) {
      this.bluetoothle.bond(this.device).subscribe(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
    }
  }

  write(writeString: string) {
    if (this.device) {
      var bytes = this.bluetoothle.stringToBytes(writeString);
      var encodedString = this.bluetoothle.bytesToEncodedString(bytes);

      let params = {
        address: this.device.address,
        service: this.service,
        characteristic: this.characteristic,
        value: encodedString
      };

      this.bluetoothle.write(params).then(res => {
        console.log(res);
      }, err => {
        console.log(err);
      });
    }
  }

  notify() {
    if (this.device) {
      var string = "Write Hello World";
      var bytes = this.bluetoothle.stringToBytes(string);
      var encodedString = this.bluetoothle.bytesToEncodedString(bytes);

      let params = {
        "service": this.service,
        "characteristic": this.characteristic,
        "value": encodedString //Subscribe Hello World
      };
      this.bluetoothle.notify(params).then(res => {
        console.log(res);
      }).catch(err => console.log(err));
    }
  }

  
}
