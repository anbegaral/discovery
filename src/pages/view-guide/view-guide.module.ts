import { NgModule } from '@angular/core';
import { TranslateModule } from "@ngx-translate/core";
import { IonicPageModule } from 'ionic-angular';
import { ViewGuidePage } from './view-guide';
import { AccordionComponentModule } from '../../components/accordion/accordion.module';

@NgModule({
  declarations: [
    ViewGuidePage,
  ],
  imports: [
    AccordionComponentModule,
    IonicPageModule.forChild(ViewGuidePage),
    TranslateModule.forChild(),
  ],
  exports: [ViewGuidePage],
})
export class ViewGuidePageModule {}
