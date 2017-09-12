import { Storage } from '@ionic/storage';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'language',
  templateUrl: 'language.html'
})
export class LanguageComponent implements OnInit {
  @Input('srcFlag') srcFlag: string; 

  constructor(public translate: TranslateService,
        private storage: Storage) {
    this.storage.get('lang').then(
      (data) => this.srcFlag = data
    );
  }

  ngOnInit() {
    this.storage.get('lang').then(
      (data) => this.srcFlag = data
    );
  }

  onChange(lang) {
    this.translate.use(lang);
    this.srcFlag = lang;
    this.storage.remove('lang');
    this.storage.set('lang', lang);
  }
}
