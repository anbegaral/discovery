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
  providers: []
})
export class PoisPageModule {}
