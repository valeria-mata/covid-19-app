import { Injectable } from '@angular/core';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {

  bluetoothStatus: any;

  constructor(private bluetooth: BluetoothLE) { }

  setBluetoothStatus(status: any) {
    this.bluetoothStatus = status;
  }

  getUBluetoothStatus() {
    return this.bluetoothStatus;
  }
  
  initBluetooth() {
    return this.bluetooth.initialize();
  }

  
}
