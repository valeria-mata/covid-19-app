import { Injectable } from '@angular/core';
import { SOCIAL_SHARING_MESSAGES, SOCIAL_MEDIA_OUTLETS } from '../constants/socials';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SharingService {

  referredShareMessage = SOCIAL_SHARING_MESSAGES;
  social = SOCIAL_MEDIA_OUTLETS;

  constructor(private socialSharing: SocialSharing, private toastCtrl: ToastController,) { }

  tryToShareVia(socialMedia: string, referredCode: string) {
    let message = this.referredShareMessage.message.replace('{referredCode}',referredCode);
    if(socialMedia === 'messenger' || socialMedia === 'facebook'){
      this.tryToShareViaFacebookProducts(socialMedia, message);
    }else{
      this.socialSharing.canShareVia(socialMedia,message,'¡También puedes formar parte del Club!',null,this.referredShareMessage.aComerClubUrl).then(() => {
        this.shareReferredCode(socialMedia,message);
      }).catch(error =>{
        console.error(`[SOCIAL SHARE] Failed to share referred code via ${socialMedia}`, error);
        this.showFailToast(socialMedia,false);
      })
    }
  }

  tryToShareViaFacebookProducts(socialMedia: string, fullMessage: string){
    if(socialMedia === 'facebook'){
      this.socialSharing.canShareVia(socialMedia, fullMessage,'¡También puedes formar parte del Club!',null,this.referredShareMessage.aComerClubUrl).then(() => {
        this.socialSharing.shareViaFacebookWithPasteMessageHint(fullMessage,null,this.referredShareMessage.aComerClubUrl).then(() => {
          this.showSuccesToast(socialMedia);
        }).catch(() => {
          let facebookLitePlatform = 'com.facebook.lite';
          this.socialSharing.canShareVia(facebookLitePlatform, fullMessage, '¡También puedes formar parte del Club!', null, this.referredShareMessage.aComerClubUrl).then(() => {
            this.socialSharing.shareVia(facebookLitePlatform, fullMessage, '¡También puedes formar parte del Club!', null, this.referredShareMessage.aComerClubUrl).then(() => {
              this.showSuccesToast('Facebook');
            }).catch(err => {
              console.error(`[SOCIAL SHARE] Failed to share referred code via Facebook`, err);
              this.showFailToast('Facebook', true);
            });
          }).catch(err => {
            console.error(`[SOCIAL SHARE] Failed to share referred code via ${socialMedia}`, err);
            this.showFailToast('Facebook', false);
          });
        });
      }).catch(() => {
        let facebookLitePlatform = 'com.facebook.lite';
        this.socialSharing.canShareVia(facebookLitePlatform, fullMessage, '¡También puedes formar parte del Club!',null,this.referredShareMessage.aComerClubUrl).then(() =>{
          this.socialSharing.shareVia(facebookLitePlatform, fullMessage, '¡También puedes formar parte del Club!', null, this.referredShareMessage.aComerClubUrl).then(() => {
            this.showSuccesToast('Facebook');
          }).catch( err => {
          console.error(`[SOCIAL SHARE] Failed to share referred code via Facebook`, err);
          this.showFailToast('Facebook',true);
          });
        }).catch(err => {
          console.error(`[SOCIAL SHARE] Failed to share referred code via ${socialMedia}`, err);
          this.showFailToast('Facebook',false);
        });
      });
    }else{
      let messengerPlatform = 'com.facebook.orca';
      this.socialSharing.canShareVia(messengerPlatform, fullMessage, '¡También puedes formar parte del Club!', null, this.referredShareMessage.aComerClubUrl).then(() => {
        this.socialSharing.shareVia(messengerPlatform, fullMessage, '¡También puedes formar parte del Club!',null,this.referredShareMessage.aComerClubUrl).then(() => {
          this.showSuccesToast(socialMedia);
        }).catch(err => {
          console.error(`[SOCIAL SHARE] Failed to share referred code via ${socialMedia}`, err);
          this.showFailToast(socialMedia, true);
        });
      }).catch(() => {
        let messengerLitePlat = 'com.facebook.mlite';
        this.socialSharing.canShareVia(messengerLitePlat, fullMessage, '¡También puedes formar parte del Club!', null, this.referredShareMessage.aComerClubUrl).then(() => {
          this.socialSharing.shareVia(messengerLitePlat, fullMessage, '¡También puedes formar parte del Club!', null, this.referredShareMessage.aComerClubUrl).then(() => {
            this.showSuccesToast('Messenger');
          }).catch(err => {
            console.error(`[SOCIAL SHARE] Failed to share referred code via Facebook`, err);
            this.showFailToast('Messenger', true);
          });
        }).catch(err => {
          console.error(`[SOCIAL SHARE] Failed to share referred code via ${socialMedia}`, err);
          this.showFailToast('Messenger', false);
        });
      });
    }
  }

  shareReferredCode(socialMedia: string, fullMessage: string){
    let socialMediaPlatform = socialMedia;
    this.socialSharing.shareVia(socialMediaPlatform, fullMessage, '¡También puedes formar parte del Club!',null,this.referredShareMessage.aComerClubUrl).then( () => {
      this.showSuccesToast(socialMedia);
    }).catch(error => {
      console.error(`[SOCIAL SHARE] Failed to share referred code via ${socialMedia}`, error);
      this.showFailToast(socialMedia,true);
    })
  }

  async showSuccesToast(appName: string) {
    let scssMessage = this.referredShareMessage.shareSuccessMessage.replace('{appName}',appName);
    const toast = await this.toastCtrl.create({
      message: scssMessage,
      duration: 5000,
      position: 'bottom',
      //showCloseButton: true
    });
    toast.present();
  }


  async showFailToast(appName: string, appIsInstalled: boolean) {
    let failMessage = this.getFailMessage(appName, appIsInstalled);
    const toast = await this.toastCtrl.create({
      message: failMessage,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  getFailMessage(socialMedia: string, appIsInstalled: boolean): string{
    switch(true){
      case (socialMedia === 'Lite'):
        return this.referredShareMessage.liteNotSupported;
      case (appIsInstalled):
        return this.referredShareMessage.shareFailureMessage.replace('{appName}', socialMedia);
      default:
        return this.referredShareMessage.appNotInstalled.replace('{appName}', socialMedia);
    }
  }


  shareWithOptionsForApple(referredCode: string) {
    let message = this.referredShareMessage.message.replace('{referredCode}',referredCode);
    this.socialSharing.shareWithOptions({
      message: message,
      url: this.referredShareMessage.aComerClubUrl      
    }).then(()=> {
      console.info('[SHARING SERVICE] Code shared correctly!');
    }).catch(error => {
      console.error('[SHARING SERVICE] Code could not be shared',error)
    });
  }

}
