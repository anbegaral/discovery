import { Media } from '@ionic-native/media';
import { PlayGuideProvider } from './../../providers/play-guide/play-guide';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilesServiceProvider } from './../../providers/files-service/files-service';
import { SQLite } from '@ionic-native/sqlite';
import { SqliteServiceProvider } from './../../providers/sqlite-service/sqlite-service';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PoisPage } from './pois';

@NgModule({
  declarations: [
    PoisPage,
  ],
  imports: [
    IonicPageModule.forChild(PoisPage),
    TranslateModule.forChild(),
  ],
  providers: [
    SqliteServiceProvider,
    SQLite,
    FilesServiceProvider,
    File,
    FileTransfer,
    PlayGuideProvider,
    Media
  ]
})
export class PoisPageModule {}
