import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterContributorPage } from './register-contributor';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RegisterContributorPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterContributorPage),
    TranslateModule.forChild(),
  ],
})
export class RegisterContributorPageModule {}
