import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { ProgressBarComponent } from './progress-bar';

@NgModule({
	declarations: [ProgressBarComponent],
	imports: [IonicModule],
	exports: [ProgressBarComponent]
})
export class ProgressBarComponentModule {}
