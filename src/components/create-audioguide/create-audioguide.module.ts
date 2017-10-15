import { NgModule } from '@angular/core';
import { CreateAudioguideComponent } from './create-audioguide';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { LocationsDropdownComponentModule } from '../locations-dropdown/locations-dropdown.module';

@NgModule({
	declarations: [CreateAudioguideComponent],
	imports: [
		LocationsDropdownComponentModule,
		IonicModule,
		TranslateModule.forChild(),],
	exports: [CreateAudioguideComponent]
})
export class CreateAudioguideComponentModule {}