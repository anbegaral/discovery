import { LocationsService } from './../../providers/locations.service';
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

  constructor(public translate: TranslateService,
    private locationService: LocationsService) {   
    this.getCountries();
    this.lang = this.translate.getDefaultLang();
  }

  getCountries() {
    this.locationService.getCountries().subscribe(countries => {
      this.countries = countries;
    })    
  }

  getLocations(idCountry: string) {
    
    if(idCountry === 'other') {
      this.showInputs();
    } else {
      this.placesDisabled = false; 
      this.locationService.getLocationsByCountry(idCountry).subscribe(locations => this.locations = locations);
      return this.locations;
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

  showLocationInput(idCountry: string) {
    this.creatingLocationEvent.emit({event, idCountry});
  }
}
