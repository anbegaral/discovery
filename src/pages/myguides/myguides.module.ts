import { CreatePoiComponentModule } from './../../components/create-poi/create-poi.module';
import { CreateAudioguideComponentModule } from './../../components/create-audioguide/create-audioguide.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { MyguidesPage } from './myguides';
import { IonicPageModule } from "ionic-angular";
import { AccordionComponentModule } from '../../components/accordion/accordion.module';
import { CreateAudioguideComponent } from '../../components/create-audioguide/create-audioguide';

@NgModule({
  declarations: [
    MyguidesPage,
  ],
  imports: [
    AccordionComponentModule,
    CreatePoiComponentModule,
    IonicPageModule.forChild(MyguidesPage),
    TranslateModule.forChild(),
  ],
  exports:[MyguidesPage],
  entryComponents: [
    // CreateAudioguideComponent,
  ],
  providers: []
})
export class MyguidesPageModule {}

