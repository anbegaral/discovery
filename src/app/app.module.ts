import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule,  TranslateLoader} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { DiscoveryAudioguides } from './app.component';

import { TabsModule } from "../pages/tabs/tabs.module";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/','.json');
}

export const firebaseConfig = {
  apiKey: "AIzaSyB0uWbXfQ3QauZzCoJZ8DjZi-PFkYEOYTQ",
  authDomain: "discoveryag-15cc2.firebaseapp.com",
  databaseURL: "https://discoveryag-15cc2.firebaseio.com",
  projectId: "discoveryag-15cc2",
  storageBucket: "discoveryag-15cc2.appspot.com",
  messagingSenderId: "79539419393"
};

@NgModule({
  declarations: [
    DiscoveryAudioguides,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TabsModule,
    IonicModule.forRoot(DiscoveryAudioguides),
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['sqlite', 'indexeddb', 'websql']
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DiscoveryAudioguides,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
