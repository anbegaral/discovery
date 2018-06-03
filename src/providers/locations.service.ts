import { Observable } from 'rxjs/Observable';
import { Country, Location } from './../model/models';
import { AngularFireDatabase } from "angularfire2/database";
import { Injectable } from '@angular/core';

@Injectable()
export class LocationsService {
    selectedCountry: Country = new Country();

    constructor(private firebase : AngularFireDatabase ) { }

    getCountries(): Observable<any[]> {
        return this.firebase.list('countries').snapshotChanges();
    }

    addCountry(country: Country) {
        return this.firebase.list('countries').push(country);
    }

    updateCountry(country: Country) {
        return this.firebase.object('countries').update(country);
    }

    getLocationsByCountry(idCountry: string): Observable<any[]> {        
        return this.firebase.list('locations', query => query.orderByChild('idCountry').equalTo(idCountry)).snapshotChanges();
    }

    getLocations(): Observable<any[]> {        
        return this.firebase.list('locations').snapshotChanges();
    }

    addLocation(location: Location) {
        return this.firebase.list('locations').push(location);
    }

    updateLocation(location: Location) {
        return this.firebase.object('locations').update(location);
    }
}