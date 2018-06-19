import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListGuidesPage } from './list-guides';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ListGuidesPage,
  ],
  imports: [
    IonicPageModule.forChild(ListGuidesPage),
    TranslateModule.forChild(),
  ],
})
export class ListGuidesPageModule {}
