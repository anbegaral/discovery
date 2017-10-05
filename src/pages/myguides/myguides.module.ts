import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { MyguidesPage } from './myguides';
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [
    MyguidesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyguidesPage),
    TranslateModule.forChild(),
  ],
  exports:[MyguidesPage],
  providers: []
})
export class MyguidesPageModule {}
