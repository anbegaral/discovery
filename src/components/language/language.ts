import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'language',
  templateUrl: 'language.html'
})
export class LanguageComponent implements OnInit {
  @Input('srcFlag') srcFlag: string; 
  
  constructor(public translate: TranslateService) { }

  ngOnInit() {
    this.srcFlag = this.translate.getDefaultLang();
  }

  onChange(e) {
    this.translate.use(e);
    this.srcFlag = e;
  }
}
