import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from "./home";
import { LanguageComponentModule } from "../../components/language/language.module";
import { IonicModule } from "ionic-angular";

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicModule,
    TranslateModule,
    LanguageComponentModule,
  ],
  exports: [HomePage]
})
export class HomePageModule {}
