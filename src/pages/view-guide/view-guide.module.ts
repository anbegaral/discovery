import { NgModule } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { IonicPageModule } from 'ionic-angular';
import { ViewGuidePage } from './view-guide';


@NgModule({
  declarations: [
    ViewGuidePage,
  ],
  imports: [
    IonicPageModule.forChild(ViewGuidePage),
    TranslateModule.forChild(),
  ],
  exports: [ViewGuidePage],
  providers: []
})
export class ViewGuidePageModule {}
