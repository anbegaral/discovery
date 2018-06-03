import { POI, User } from './../../model/models';
import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Audioguide, Country, Location } from '../../model/models';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class FirebaseServiceProvider {

  audioguides: AngularFireList<Audioguide> = null;
  audioguides$: Observable<any[]> = null;
  audioguide$: Observable<any[]> = null;
  audioguide: AngularFireObject<Audioguide> = null;
  storageImageRef: any;

  pois: AngularFireList<POI> = null;

  countries: AngularFireList<Country> = null;
  country: AngularFireObject<Country> = null;
  locations: AngularFireList<Location> = null;
  // location: AngularFireObject<Location> = null;
  
  users: AngularFireList<User> = null;

  constructor(private angFireDatabase: AngularFireDatabase, private alertCtrl: AlertController) {
    this.countries = this.getCountries({})
    this.locations = this.getLocations({})
    this.users = this.getUsers({})
  }

  getCountries(query:{}) {
    this.countries = this.angFireDatabase.list('countries', query => query);
    return this.countries
  }

  // Return a single observable Audioguide
  getCountry(key: string) {
    this.country = this.angFireDatabase.object(`countries/${key}`)
    return this.country;
  }

  addCountry(country: Country) {
    return this.countries.push(country).then(snapshot => {
      console.log(snapshot.key)
      return snapshot.key
    })
  }

  getLocations(query:{}) { 
    return this.locations = this.angFireDatabase.list('locations', query => query)
  }

  addLocation(location: Location) {
    return this.locations.push(location).then(snapshot => {
      console.log(snapshot.key)
      return snapshot.key
    })
  }

  getAudioguidesList(): Observable<any[]> {
    return this.audioguides$ = this.angFireDatabase.list('audioguides').valueChanges();
  }

  // Return a single observable Audioguide
  // getAudioguide(key: string) {
  //   // this.audioguide = this.angFireDatabase.object(`audioguides/${key}`)
  //   this.audioguide = this.angFireDatabase.object(`audioguide/${key}`).valueChanges();
  //   // this.audioguide = this.angFireDatabase.list('audioguides', query => query.orderByChild('id').equalTo('id'))
  //   console.log(this.audioguide)
  //   return this.audioguide;
  // }

  createAudioguide(audioguide: Audioguide) {
    // this.audioguides.push(audioguide).then(idAudioguide => {
    //   return idAudioguide.key
    // })
  }

  // getPoisList(query:{}): AngularFireList<POI> {
  //   this.pois = this.angFireDatabase.list('poi', query => query);
  //   return this.pois;
  // }
  
  // searchGuides(start, end): AngularFireList<Audioguide> {
  //   return this.angFireDatabase.list('audioguides', query => query.orderByChild('title').startAt(start).endAt(end));
  // }

  getUsers(query:{}): AngularFireList<User> {
    this.users = this.angFireDatabase.list('users', query => query);
    return this.users;
  }

  addUser(user: User) {
    return this.users.push(user).then(idAuthor => {
      console.log(idAuthor.key)
      return idAuthor.key
    })
  }

  updateUser(key: string, user: User) {
    return this.users.update(key, user)
      .catch(error => this.handleError(error))
  }

  // Default error handling for all actions
  private handleError(error) {
    this.alertCtrl.create({
      title: 'Error',
      message: error.message,
      buttons: [
        {
          text: 'Close',
          handler: data => console.log(data)
        }
      ]
    }).present();
  }
}
