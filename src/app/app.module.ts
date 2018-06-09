import { CreateAudioguideComponentModule } from './../components/create-audioguide/create-audioguide.module';
import { CreateAudioguideComponent } from './../components/create-audioguide/create-audioguide';
import { Camera } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FirebaseServiceProvider } from './../providers/firebase-service/firebase-service';
import { Media } from '@ionic-native/media';
import { PlayGuideProvider } from './../providers/play-guide/play-guide';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FilesServiceProvider } from './../providers/files-service/files-service';
import { SQLite } from '@ionic-native/sqlite';
import { SqliteServiceProvider } from './../providers/sqlite-service/sqlite-service';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { DiscoveryAudioguides } from './app.component';

import { TabsModule } from "../pages/tabs/tabs.module";
import { CreatePoiComponent } from '../components/create-poi/create-poi';
import { CreatePoiComponentModule } from '../components/create-poi/create-poi.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
         driverOrder: ['sqlite', 'websql', 'indexeddb']
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    CreateAudioguideComponentModule,
    CreatePoiComponentModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    DiscoveryAudioguides,
    CreateAudioguideComponent,
    CreatePoiComponent,
  ],
  providers: [
    StatusBar,
    HttpClientModule,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SqliteServiceProvider,
    SQLite,
    FilesServiceProvider,
    File,
    FileTransfer,
    FilePath,
    PlayGuideProvider,
    Media,
    FirebaseServiceProvider,
    Camera,
  ],
  exports: [
    TranslateModule,
  ]
})
export class AppModule {}
