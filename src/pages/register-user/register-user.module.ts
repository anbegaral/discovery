import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterUserPage } from './register-user';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    RegisterUserPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterUserPage),
    TranslateModule.forChild(),
  ],
})
export class RegisterUserPageModule {}
