import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { TranslateService } from "@ngx-translate/core";
import { Audioguide } from '../../model/models';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  
  countries: any[];
  locations: any[];

  audioguides: Audioguide[];
  audioguidesSearched: Audioguide[];

  lang: string;

  placesDisabled = true;
  isSearched = true;
  lastKeyPress: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private firebaseService: FirebaseServiceProvider, public translate: TranslateService) {
      this.lang = this.translate.getDefaultLang();
  }

  ngOnInit() { 
    this.getCountries();
    this.getAudioguides();
  }

  getCountries() {
    this.firebaseService.getCountries({}).subscribe(countries => this.countries = countries)
  }

  getLocations(idCountry: string) { 
    this.placesDisabled = false; 
    this.firebaseService.getLocations({
          orderByChild: 'idCountry',
          equalTo: idCountry
    }).subscribe(locations => this.locations = locations)
  }

  getAudioguides(idLocation?: string) {
    this.firebaseService.getAudioguidesList({
          orderByChild: 'idLocation',
          equalTo: idLocation
    }).subscribe(audioguides => {
      this.audioguides = audioguides
      this.audioguidesSearched = audioguides
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
