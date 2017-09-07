import { NgModule } from '@angular/core';
import { MyguidesPage } from './myguides';
import { IonicModule } from "ionic-angular";

@NgModule({
  declarations: [
    MyguidesPage,
  ],
  imports: [IonicModule],
  exports:[MyguidesPage],
})
export class MyguidesPageModule {}
