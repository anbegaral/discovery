import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage, NavParams, LoadingController } from 'ionic-angular';
import { TranslateService } from "@ngx-translate/core";
import { Audioguide } from '../../model/models';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  audioguides: Audioguide[];
  audioguidesSearched: Audioguide[];
  storageImageRef: any;
  loader: any;

  lang: string;

  isSearched = true;
  lastKeyPress: number = 0;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private firebaseService: FirebaseServiceProvider, 
    public translate: TranslateService,
    private loadingCtrl: LoadingController) {
      this.lang = this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.getAudioguides();
  }

  getAudioguides($event?) {
    this.loader = this.loadingCtrl.create({
      content: `Loading audioguides...`
    });
    this.loader.present()
    let idLocation = $event
    this.firebaseService.getAudioguidesList({
          orderByChild: 'idLocation',
          equalTo: idLocation
    }).subscribe(audioguides => {
      this.audioguides = audioguides;
      this.audioguides = this.audioguides.filter(audioguide => {
        return audioguide.reviewed === true;
      })
      this.audioguidesSearched = this.audioguides
      this.loader.dismiss();
    })
  }

  initializeList(): void {
    this.audioguides = this.audioguidesSearched;
  }

  searchAudioguides($event) {
    this.initializeList();

    let val = $event.target.value;
    
    if (val && val.trim() !== '') {
      this.audioguides = this.audioguides.filter((item) => {
        return (item.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  viewGuide(idGuide: string) {
    this.navCtrl.push('ViewGuidePage', idGuide);
  }
}
