import { POI } from './../../model/models';
import { AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Audioguide } from '../../model/models';


@Injectable()
export class FirebaseServiceProvider {

  audioguides: FirebaseListObservable<Audioguide[]> = null;
  audioguide: FirebaseObjectObservable<Audioguide> = null;

  pois: FirebaseListObservable<POI[]> = null;

  countries: FirebaseListObservable<any[]> = null;
  locations: FirebaseListObservable<any[]> = null;

  constructor(private angFireDatabase: AngularFireDatabase, private alertCtrl: AlertController) {
  }

  getCountries(query:{}) {
    this.countries = this.angFireDatabase.list('countries', {
      query: query
    });
    return this.countries
  }

  getLocations(query:{}) { 
    this.locations = this.angFireDatabase.list('locations', {
        query: query
    });
    return this.locations
  }

  getAudioguidesList(query:{}): FirebaseListObservable<Audioguide[]> {
    this.audioguides = this.angFireDatabase.list('audioguides', {
      query: query
    });
    return this.audioguides
  }

  // Return a single observable Audioguide
  getAudioguide(key: string): FirebaseObjectObservable<Audioguide> {
    this.audioguide = this.angFireDatabase.object(`audioguides/${key}`)
    return this.audioguide
  }

  createAudioguide(audioguide: Audioguide): void  {
    this.audioguides.push(audioguide)
      .catch(error => this.handleError(error))
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
