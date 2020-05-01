import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Injectable({
  providedIn: 'root'
})
export class ZipService {

  constructor() { }

  generateZip(name: string, content: any){
    const zip = new JSZip();
    const folder = zip.folder(name);
    const number = content.length;
    for(let i = 0; i < number; i++){
      folder.file(content[i]);
    }

    zip.generateAsync({type: "uint8array"}).then(function (u8) {
      return u8;
    }, err => {
      console.log(err);
    });

  }
}
