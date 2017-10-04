import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { SQLite } from '@ionic-native/sqlite';
import { FilesServiceProvider } from './../../providers/files-service/files-service';
import { PlayGuideProvider } from './../../providers/play-guide/play-guide';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { NgModule } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { IonicPageModule } from 'ionic-angular';
import { ViewGuidePage } from './view-guide';
import { SqliteServiceProvider } from '../../providers/sqlite-service/sqlite-service';
import { Media } from '@ionic-native/media';

@NgModule({
  declarations: [
    ViewGuidePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewGuidePage),
    TranslateModule.forChild(),
  ],
  exports: [ViewGuidePage],
  providers: [
    SQLite,
    FirebaseServiceProvider, 
    PlayGuideProvider,
    SqliteServiceProvider,
    FilesServiceProvider,
    Media,
    File,
    FileTransfer
  ]
})
export class ViewGuidePageModule {}
