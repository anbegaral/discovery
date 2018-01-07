import { CreatePoiComponent } from "./create-poi";
import { NgModule } from "@angular/core";
import { IonicModule } from "ionic-angular";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
	declarations: [CreatePoiComponent],
	imports: [
		IonicModule,
		TranslateModule.forChild(),],
	exports: [CreatePoiComponent]
})
export class CreatePoiComponentModule {}