import { POI, User } from './../../model/models';
import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Audioguide, Country, Location } from '../../model/models';


@Injectable()
export class FirebaseServiceProvider {

  audioguides: FirebaseListObservable<Audioguide[]> = null;
  audioguide: Audioguide = null;
  storageImageRef: any;

  pois: FirebaseListObservable<POI[]> = null;

  countries: FirebaseListObservable<Country[]> = null;
  country: FirebaseObjectObservable<Location> = null;
  locations: FirebaseListObservable<Location[]> = null;
  location: FirebaseObjectObservable<Location> = null;
  
  users: FirebaseListObservable<User[]> = null;

  constructor(private angFireDatabase: AngularFireDatabase, private alertCtrl: AlertController) {
    this.countries = this.getCountries({})
    this.locations = this.getLocations({})
    this.users = this.getUsers({})
  }

  getCountries(query:{}) {
    this.countries = this.angFireDatabase.list('countries', {
      query: query
    });
    return this.countries
  }

  // Return a single observable Audioguide
  getCountry(key: string) {
    return this.angFireDatabase.object(`countries/${key}`)
  }

  addCountry(country: Country) {
    return this.countries.push(country).then(snapshot => {
      console.log(snapshot.key)
      return snapshot.key
    }).catch(error => this.handleError(error))
  }

  getLocations(query:{}) { 
    this.locations = this.angFireDatabase.list('locations', {
        query: query
    });
    return this.locations
  }

  addLocation(location: Location) {
    return this.locations.push(location).then(snapshot => {
      console.log(snapshot.key)
      return snapshot.key
    }).catch(error => this.handleError(error))
  }

  getAudioguidesList(query:{}): FirebaseListObservable<Audioguide[]> {
    this.audioguides = this.angFireDatabase.list('audioguides', {
      query: query
    });
    
    return this.audioguides
  }

  // Return a single observable Audioguide
  getAudioguide(key: string): Audioguide {
    this.angFireDatabase.object(`audioguides/${key}`).subscribe((audioguide) => {
      this.audioguide = audioguide;
    })    
    return this.audioguide
  }

  createAudioguide(audioguide: Audioguide): string {
    return this.audioguides.push(audioguide).then(idAudioguide => {
      return idAudioguide.key
    }).catch(error => this.handleError(error))
  }

  getPoisList(query:{}): FirebaseListObservable<POI[]> {
    this.pois = this.angFireDatabase.list('poi', {
      query: query
    });
    return this.pois
  }
  
  searchGuides(start, end): FirebaseListObservable<Audioguide[]> {
    return this.angFireDatabase.list('audioguides', {
      query: {
        orderByChild: 'title',
        startAt: start,
        endAt: end
      }
    });
  }

  getUsers(query:{}) {
    this.users = this.angFireDatabase.list('users', {
      query: query
    })
    return this.users
  }

  addUser(user: User) {
    return this.users.push(user).then(idAuthor => {
      console.log(idAuthor.key)
      return idAuthor.key
    }).catch(err => this.handleError(err))
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
