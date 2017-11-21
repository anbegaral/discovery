import { NgModule } from '@angular/core';
import { CreateAudioguideComponent } from './create-audioguide/create-audioguide';
import { LocationsDropdownComponent } from './locations-dropdown/locations-dropdown';
@NgModule({
	declarations: [CreateAudioguideComponent,
    LocationsDropdownComponent],
	imports: [],
	exports: [CreateAudioguideComponent,
    LocationsDropdownComponent]
})
export class ComponentsModule {}
