import { LocationsService } from './../../providers/locations.service';
import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage, NavParams, LoadingController } from 'ionic-angular';
import { TranslateService } from "@ngx-translate/core";
import { Location, Country } from '../../model/models';
import { AudioguideService } from '../../providers/audioguide.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  locations: Location[] = [];
  locationsSearched: Location[] = [];
  country: Country;
  numberOfAudioguides = 0;
  storageImageRef: any;
  loader: any;

  lang: string;

  isSearched = true;
  lastKeyPress: number = 0;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private audioguideService: AudioguideService,
    private locationService: LocationsService,
    public translate: TranslateService,
    private loadingCtrl: LoadingController) {
      this.lang = this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.getLocations();
  }

  getLocations($event?) {
    this.loader = this.loadingCtrl.create({
      content: `Loading locations...`
    });
    this.loader.present();
    let idLocation = $event;
    this.locationService.getLocations().subscribe(locations => {
      this.locations = [];
      locations.forEach(element => {
        // Getting the location by selected lang
        let locationName = element.language.find(language => language.code === this.lang);
        element.locationName = locationName.name; 
        // Getting the audioguides by location       
        this.audioguideService.getAudioguideListByLocation(element.key).subscribe(audioguides => {
          audioguides = audioguides.filter(audioguide => audioguide.reviewed === true)
          if(idLocation !== undefined) {
            audioguides = audioguides.filter(audioguide => {
                audioguide.idLocation === idLocation;
            })
          }          
          element.numberOfAudioguides = audioguides.length;          
          if(element.numberOfAudioguides > 0) { 
            // Getting the country by location
            this.locationService.getCountryById(element.idCountry).subscribe(country => {
              let countryName = country[0].language.find(language => language.code === this.lang);
              element.countryName = countryName.name;              
            })           
            this.locations.push(element);            
          }
        });
      });
      this.locationsSearched = this.locations; 
      console.log(this.locations)
      this.loader.dismiss();
    }, error => console.log(error)
    );
  }

  initializeList(): void {
    this.locations = this.locationsSearched;
  }

  searchLocations($event) {
    
    this.initializeList();
    
    let val = $event.target.value;
    if (val && val.trim() !== '') {
      this.locations = this.locations.filter(location => {
        return location.language.filter(language => language.name.toLowerCase().indexOf(val.toLowerCase()) > -1).length > 0
      })
    }
  }

  openLocation(location: Location) {
    this.navCtrl.push('ListGuidesPage', location);
  }
}
