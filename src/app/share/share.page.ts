import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SharingMessage } from '../constants/socials';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-share',
  templateUrl: './share.page.html',
  styleUrls: ['./share.page.scss'],
})
export class SharePage implements OnInit {

  shareOptions = SharingMessage;

  constructor(private router: Router, private share: SocialSharing, public alertController: AlertController) { }

  ngOnInit() {
  }

  async presentAlert(header, msg) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  openShare(){
    const header = 'Opción inválida';
    const message = 'Hubo un error al intentar compartir, inténtalo más tarde';
    this.share.share(this.shareOptions.message, this.shareOptions.subject, this.shareOptions.file, this.shareOptions.url)
      .then(value => {
        this.router.navigate(['recommendations']);
    }, err => {
      this.presentAlert(header, message);
    })
    
  }

  skipShare() {
    this.router.navigate(['recommendations']);
  }

}
