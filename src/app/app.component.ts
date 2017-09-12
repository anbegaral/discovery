import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class DiscoveryAudioguides implements OnInit{
  rootPage:any = 'TabsPage';
  token:any;
  lang:string;

  constructor(private platform: Platform,
      private statusBar: StatusBar,
      private splashScreen: SplashScreen,
      public translate: TranslateService,
      private storage: Storage) {

    translate.setDefaultLang('en');

    translate.reloadLang('en');
    translate.reloadLang('es');
    translate.reloadLang('fr');
    
  }

  ngOnInit() {

    this.getLanguage();
    
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    }
  }

  getLanguage() {
    this.storage.get('lang').then(
      (data) => {
        this.lang = data
        
        if(this.lang === null || this.lang === 'undefined'){
          this.translate.use('en');
        } else {
          this.translate.use(this.lang);
        }
      }
    );
  }
}
