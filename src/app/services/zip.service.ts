import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class ZipService {

  constructor() { }

  generateZip(name: string, content: any): Promise<any>{

    return new Promise((resolve, reject) => {
      const zip = new JSZip();
      const folder = zip.folder(name);
      const number = content.length;
      for(let i = 0; i < number; i++){
        folder.file(content[i]);
      }
      let res : any;
      zip.generateAsync({type: "base64"}).then(function(resultant) {
        res = resultant;
        resolve(resultant);
      }, err => {
        console.log(err);
      });
    });
  }
}
