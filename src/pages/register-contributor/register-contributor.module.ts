import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterContributorPage } from './register-contributor';

@NgModule({
  declarations: [
    RegisterContributorPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterContributorPage),
  ],
})
export class RegisterContributorPageModule {}
