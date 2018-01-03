import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from 'ionic-angular';
import { AccordionComponent } from "./accordion";

@NgModule({
	declarations: [AccordionComponent],
	imports: [
		IonicModule,
		TranslateModule.forChild()],
	exports: [AccordionComponent]
})
export class AccordionComponentModule {}