import { Storage } from '@ionic/storage';
import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";


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
    console.log(idLocation)
    this.audioguides = this.afDB.list('audioguides', {
        query: {
          orderByChild: 'idLocation',
          equalTo: idLocation
        }
      }
    );
  }

  // getImages() {
  //   let storage = firebase.storage();
  //   var storageRef = storage.ref();
  //   // Create a reference to the file we want to download
  //   var starsRef = storageRef.child('images/IMG_0956 (1).JPG');
  //   // Get the download URL      
  //    starsRef.getDownloadURL().then(url => this.image = url  ); 
  // }
}
