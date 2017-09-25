import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";
import { Subject } from "rxjs/Subject";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  
  countries: FirebaseListObservable<any[]>;
  locations: FirebaseListObservable<any[]>;
  audioguides: FirebaseListObservable<any[]>;

  audioguidesSearched: FirebaseListObservable<any[]>;
  startAt = new Subject();
  endAt = new Subject();
  
  lang: string;

  placesDisabled = true;
  isSearched = true;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private afDB: AngularFireDatabase,
    public translate: TranslateService) {
      this.lang = this.translate.getDefaultLang();
  }

  ngOnInit() { 
    this.getCountries();
    this.getGuides();
    this.searchGuides(this.startAt, this.endAt).subscribe(list => this.audioguidesSearched = list);
  }

  getCountries() {
    this.countries = this.afDB.list('countries');
  }

  getLocations(idCountry: string) { 
    this.placesDisabled = false; 
    this.locations = this.afDB.list('locations', {
        query: {
          orderByChild: 'idCountry',
          equalTo: idCountry
        }
      }
    );
  }

  getGuides(idLocation?: string) {
    this.audioguides = this.afDB.list('audioguides', {
        query: {
          orderByChild: 'idLocation',
          equalTo: idLocation
        }
      }
    );
  }

  searchGuides(start, end): FirebaseListObservable<any> {
    return this.afDB.list('audioguides', {
      query: {
        orderByChild: 'title',
        startAt: start,
        endAt: end
      }
    });
  }

  searchAudioguides($event) {
    let q = $event.target.value;
    this.startAt.next(q)
    this.endAt.next(q+"\uf8ff")
    this.isSearched = false;
  }

  viewGuide(idGuide: string) {
    this.navCtrl.push('ViewGuidePage', idGuide);
  }
}
