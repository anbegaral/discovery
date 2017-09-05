import { NgModule } from '@angular/core';
import { HomePage } from "./home";
import { LanguageComponentModule } from "../../components/language/language.module";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [HomePage],
  imports: [
    LanguageComponentModule,
    IonicPageModule.forChild(HomePage),
  ],
  exports: [HomePage]
})
export class HomePageModule {}
