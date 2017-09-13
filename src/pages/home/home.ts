import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";

declare var firebase: any;

interface Image {
    path: string;
    filename: string;
    downloadURL?: string;
    $key?: string;
}

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  
  countries: FirebaseListObservable<any[]>;
  locations: FirebaseListObservable<any[]>;
  audioguides: FirebaseListObservable<any[]>;

  lang: string;

  placesDisabled = true;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage, 
    private afDB: AngularFireDatabase) {
    
  }

  ngOnInit() {
    this.getLang();    
    this.getCountries();
    this.getGuides();
  }
  
  getLang() {
    this.storage.get('lang').then(
      (lang) => this.lang = lang,
      (err) => {
        if (err.error instanceof Error) {
          console.log("getLang method: Client-side error occured.");
        } else {
          console.log("getLang method: Server-side error occured.");
        }
      }  
    );    
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

  viewGuide(idGuide: string) {
    this.navCtrl.push('GuidesPage', idGuide);
  }
}
