import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country, Location } from './../model/models';
import { AngularFireDatabase } from "angularfire2/database";
import { Injectable } from '@angular/core';

@Injectable()
export class LocationsService {
    selectedCountry: Country = new Country();

    constructor(private firebase : AngularFireDatabase ) { }

    getCountries(): Observable<Country[]> {
        return this.firebase.list('countries').snapshotChanges().pipe(map(actions => actions.map(obj => ({ key: obj.payload.key, ...obj.payload.val() }))));
    }

    addCountry(country: Country) {
        return this.firebase.list('countries').push(country);
    }

    updateCountry(country: Country) {
        return this.firebase.object('countries').update(country);
    }

    getCountryById(id: string): Observable<Country[]> {        
        return this.firebase.list('countries', query => query.orderByKey().equalTo(id)).snapshotChanges().pipe(map(actions => actions.map(obj => ({ key: obj.payload.key, ...obj.payload.val() }))));
    }

    getLocationsByCountry(idCountry: string): Observable<Location[]> {        
        return this.firebase.list('locations', query => query.orderByChild('idCountry').equalTo(idCountry)).snapshotChanges().pipe(map(actions => actions.map(obj => ({ key: obj.payload.key, ...obj.payload.val() }))));
    }

    getLocations(): Observable<Location[]> {        
        return this.firebase.list('locations').snapshotChanges().pipe(map(actions => actions.map(obj => ({ key: obj.payload.key, ...obj.payload.val() }))));
    }

    addLocation(location: Location) {
        return this.firebase.list('locations').push(location);
    }

    updateLocation(location: Location) {
        return this.firebase.object('locations').update(location);
    }
}