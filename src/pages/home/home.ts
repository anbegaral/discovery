import { LocationsService } from './../../providers/locations.service';
import { Component, OnInit } from '@angular/core';
import { NavController, IonicPage, NavParams, LoadingController } from 'ionic-angular';
import { TranslateService } from "@ngx-translate/core";
import { Audioguide, Location } from '../../model/models';
import { AudioguideService } from '../../providers/audioguide.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  audioguides: Audioguide[] = [];
  audioguidesSearched: Audioguide[];
  locations: Location[] = [];
  locationsSearched: Location[];
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
        var y = element.payload.toJSON();
        y['language'] = Object.values(y['language']);               
        y["$key"] = element.key;

        this.audioguideService.getAudioguideListByLocation(element.key).subscribe(audioguides => {
          this.audioguides = [];
          audioguides.forEach(element => {        
            var y = element.payload.toJSON();        
            y["$key"] = element.key;
            this.audioguides.push(y as Audioguide);       
          });
          this.audioguides = this.audioguides.filter(audioguide => {
            return audioguide.reviewed === true;
          })
          if(idLocation !== undefined) {
              this.audioguides = this.audioguides.filter(audioguide => {
                return audioguide.idLocation === idLocation;
              })
          }
          y['numberOfAudioguides'] = this.audioguides.length;
          if(y['numberOfAudioguides'] > 0) {
            this.locations.push(y as Location);            
          }
        });
      });
      this.locationsSearched = this.locations; 
      this.loader.dismiss();
    });
  }

  initializeList(): void {
    this.locations = this.locationsSearched;
  }

  searchLocations($event) {
    this.initializeList();
    let val = $event.target.value;
    
    if (val && val.trim() !== '') {
      this.locations = this.locations.filter(location => location.language.filter(language => language.name.toLowerCase().indexOf(val.toLowerCase()) > -1).length > 0);
    }
  }

  viewGuide(audioguide: Audioguide) {
    this.navCtrl.push('ViewGuidePage', audioguide);
  }

  openLocation(location: Location) {
    this.navCtrl.push('ViewGuidePage', location);
  }
}
