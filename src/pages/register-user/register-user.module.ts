import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterUserPage } from './register-user';
import { TranslateModule } from "@ngx-translate/core";
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    RegisterUserPage,
  ],
  imports: [
    ReactiveFormsModule,
    IonicPageModule.forChild(RegisterUserPage),
    TranslateModule.forChild(),
  ],
  providers: []
})
export class RegisterUserPageModule {}
