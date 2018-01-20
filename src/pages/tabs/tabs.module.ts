import { NgModule } from '@angular/core';
import { IonicPageModule } from "ionic-angular";
import { TranslateModule } from '@ngx-translate/core';
import { TabsPage } from "./tabs";
import { IconsModule } from '../../providers/utils/icons.module';

@NgModule({
  declarations:[TabsPage],
  imports:[
    IconsModule,
    IonicPageModule.forChild(TabsPage),
    TranslateModule.forChild(),
  ],
  exports:[TabsPage],
  entryComponents:[
    TabsPage,
  ]
})
export class TabsModule {
}
