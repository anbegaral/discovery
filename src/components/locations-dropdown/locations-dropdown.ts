import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Country, Location } from '../../model/models';

@Component({
  selector: 'locations-dropdown',
  templateUrl: 'locations-dropdown.html'
})
export class LocationsDropdownComponent {

  @ViewChild('idcountry') idcountry: string;
  lang: string;
  @Input() creating?: boolean;
  @Output() creatingEvent = new EventEmitter<boolean>();
  @Output() creatingLocationEvent = new EventEmitter<any>();
  
  @Output() idLocationEvent = new EventEmitter<string>();

  countries: Country[] = [];
  locations: Location[] = [];

  placesDisabled = true;

  constructor(private firebaseService: FirebaseServiceProvider, public translate: TranslateService) {   
    this.getCountries();
    this.lang = this.translate.getDefaultLang();
  }

  getCountries() {
    this.firebaseService.getCountries({}).subscribe(countries => {
      this.countries = countries
    })
  }

  getLocations(idCountry: string) { 
    if(idCountry === 'other') {
      this.showInputs();
    } else {
      this.placesDisabled = false; 
      this.firebaseService.getLocations({
            orderByChild: 'idCountry',
            equalTo: idCountry
      }).subscribe(locations => this.locations = locations)
    }
    
  }

  sendLocation(idLocation) {
    if(idLocation === 'other') {
      this.showLocationInput(this.idcountry);
    } else {
      this.idLocationEvent.emit(idLocation);
    }
  }

  showInputs() {
    this.creatingEvent.emit(true);
  }

  showLocationInput(idcountry: string) {
    this.creatingLocationEvent.emit({event, idcountry});
  }
}
