import { CreatePoiComponentModule } from './../../components/create-poi/create-poi.module';
import { CreateAudioguideComponentModule } from './../../components/create-audioguide/create-audioguide.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { MyguidesPage } from './myguides';
import { IonicPageModule } from "ionic-angular";
import { AccordionComponentModule } from '../../components/accordion/accordion.module';

@NgModule({
  declarations: [
    MyguidesPage,
  ],
  imports: [
    AccordionComponentModule,
    CreateAudioguideComponentModule,
    CreatePoiComponentModule,
    IonicPageModule.forChild(MyguidesPage),
    TranslateModule.forChild(),
  ],
  exports:[MyguidesPage],
  providers: []
})
export class MyguidesPageModule {}
