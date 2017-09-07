import { Component, OnInit } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';


import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class DiscoveryAudioguides implements OnInit{
  rootPage:any = TabsPage;

  constructor(private platform: Platform,
      private statusBar: StatusBar,
      private splashScreen: SplashScreen,
      public translate: TranslateService) {

    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {

    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
      });
    }
  }
}
