import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class ZipService {

  constructor() { }

  generateZip(name: string, content: any){
    alert('funcion zip');
    const zip = new JSZip();
    const folder = zip.folder(name);
    const number = content.length;
    for(let i = 0; i < number; i++){
      alert(content[i]);
      folder.file(content[i]);
    }

    zip.generateAsync({type: "uint8array"}).then(function (u8) {
      alert('zip generado');
      alert(u8);
      return u8;
    }, err => {
      console.log(err);
    });

  }
}
