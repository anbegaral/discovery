import { NgModule } from '@angular/core';
import { MyguidesPage } from './myguides';
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [
    MyguidesPage,
  ],
  imports: [IonicPageModule.forChild(MyguidesPage)],
  exports:[MyguidesPage],
})
export class MyguidesPageModule {}
