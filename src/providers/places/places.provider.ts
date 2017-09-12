import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { AngularFireDatabase, FirebaseListObservable } from "angularfire2/database";


@Injectable()
export class PlacesProvider {
  
  constructor(public httpClient: HttpClient, private afDB: AngularFireDatabase) {
  }

  getCountries(): FirebaseListObservable<any[]> {
    return this.afDB.list('/countries');
  }

  // getLocations(countryId?: string): Observable<string[]> {
  //   return this.httpClient.get<string[]>(this.urlBase + 'locations.json');
  // }

  // getLocationsByCountry(countryId: string): Observable<string[]> {
  //   return this.httpClient.get<string[]>(this.urlBase + 'locations/'+ countryId);
  // }

  // getAudioguides(countryId?: string): Observable<string[]> {
  //   return this.httpClient.get<string[]>(this.urlBase + 'audioguides.json');
  // }
}
