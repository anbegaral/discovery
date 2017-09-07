import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { DiscoveryAudioguides } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MyguidesPage } from "../pages/myguides/myguides";
import { HomePageModule } from "../pages/home/home.module";

@NgModule({
  declarations: [
    DiscoveryAudioguides,
    AboutPage,
    ContactPage,
    TabsPage,
    MyguidesPage
  ],
  imports: [
    BrowserModule,
    HomePageModule,
    IonicModule.forRoot(DiscoveryAudioguides)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DiscoveryAudioguides,
    AboutPage,
    ContactPage,
    TabsPage,
    MyguidesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
