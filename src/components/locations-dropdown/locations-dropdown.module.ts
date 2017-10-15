import { NgModule } from '@angular/core';
import { LocationsDropdownComponent } from './locations-dropdown';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';

@NgModule({
	declarations: [LocationsDropdownComponent],
	imports: [
		IonicModule,
		TranslateModule.forChild(),
	],
	exports: [LocationsDropdownComponent]
})
export class LocationsDropdownComponentModule {}