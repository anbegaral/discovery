import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class DiscoveryAudioguides {
  rootPage:string;
  alertTitle: string;

  constructor(private platform: Platform,
      private statusBar: StatusBar,
      private splashScreen: SplashScreen,
      public translate: TranslateService,
      private storage: Storage,
      private alertCtrl: AlertController) {
        
        this.platform.ready().then(() => {
          this.storage.ready().then(
            () => this.storage.get('lang').then(
              (data) => {
                if (data === null || data === 'undefined') {
                  this.setLanguage();  
                  this.splashScreen.hide()        
                } else {
                  this.translate.use(data);
                }
              }
            )
          );
        });
  }

  setLanguage() {
    let prompt = this.alertCtrl.create({
      title: this.alertTitle,
      inputs: [
        {
          value: 'en',
          label: 'English',
          type: 'radio',
          checked: true
        },
        {
          value: 'es',
          label: 'Español',
          type: 'radio'
        },
        {
          value: 'fr',
          label: 'Français',
          type: 'radio'
        },
      ],
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            this.translate.setDefaultLang(data);
            this.translate.use(data);
            this.storage.set('lang', data);
            this.rootPage = 'TabsPage';
          }
        },
      ]
    });
    prompt.present();
  }
}
