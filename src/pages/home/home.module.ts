import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from "./home";
import { IonicPageModule } from "ionic-angular";


@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPageModule.forChild(HomePage),
    TranslateModule.forChild(),
  ],
  exports: [HomePage],
  providers: [FirebaseServiceProvider]
})
export class HomePageModule {}
