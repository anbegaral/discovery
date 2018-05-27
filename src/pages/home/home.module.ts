import { LocationsService } from './../../providers/locations.service';
import { LocationsDropdownComponentModule } from './../../components/locations-dropdown/locations-dropdown.module';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from "./home";
import { IonicPageModule } from "ionic-angular";

@NgModule({
  declarations: [HomePage],
  imports: [
    IonicPageModule.forChild(HomePage),
    TranslateModule.forChild(),
    LocationsDropdownComponentModule,
  ],
  exports: [HomePage],
  providers: [LocationsService]
})
export class HomePageModule {}
