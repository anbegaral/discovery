import { FileTransfer } from '@ionic-native/file-transfer';
import { FilesServiceProvider } from './../../providers/files-service/files-service';
import { SQLite } from '@ionic-native/sqlite';
import { File } from '@ionic-native/file';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { MyguidesPage } from './myguides';
import { IonicPageModule } from "ionic-angular";
import { SqliteServiceProvider } from '../../providers/sqlite-service/sqlite-service';

@NgModule({
  declarations: [
    MyguidesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyguidesPage),
    TranslateModule.forChild(),
  ],
  exports:[MyguidesPage],
  providers: [
    SqliteServiceProvider,
    FilesServiceProvider,
    File,
    FileTransfer,
    SQLite,
  ]
})
export class MyguidesPageModule {}
