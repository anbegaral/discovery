import { PlacesProvider } from './../../providers/places/places.provider';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from "./home";
import { LanguageComponentModule } from "../../components/language/language.module";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPageModule.forChild(HomePage),
    TranslateModule,
    LanguageComponentModule,
  ],
  exports: [HomePage],
  providers: [
    PlacesProvider,
  ]
})
export class HomePageModule {}
