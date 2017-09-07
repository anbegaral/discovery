import { NgModule } from '@angular/core';
import { IonicModule } from "ionic-angular";
import { TranslateModule } from '@ngx-translate/core';
import { TabsPage } from "./tabs";
import { HomePage } from "../home/home";
import { MyguidesPage } from "../myguides/myguides";
import { DiscoverPage } from "../discover/discover";
import { SettingsPage } from "../settings/settings";
import { HomePageModule } from "../home/home.module";
import { MyguidesPageModule } from "../myguides/myguides.module";
import { DiscoverPageModule } from "../discover/discover.module";
import { SettingsPageModule } from "../settings/settings.module";

@NgModule({
  declarations:[TabsPage],
  imports:[
    IonicModule,
    TranslateModule,
    HomePageModule,
    MyguidesPageModule,
    DiscoverPageModule,
    SettingsPageModule,
  ],
  exports:[TabsPage],
  entryComponents:[
    TabsPage,
    HomePage,
    MyguidesPage,
    DiscoverPage,
    SettingsPage,
  ]  //<--add all your module components to here
})
export class TabsModule {
}
