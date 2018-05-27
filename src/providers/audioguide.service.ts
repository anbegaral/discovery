import { Audioguide } from './../model/models';
import { AngularFireList, AngularFireDatabase } from "angularfire2/database";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AudioguideService {
  selectedAudioguide: Audioguide = new Audioguide();

  constructor(private firebase : AngularFireDatabase ) { }
 
  getAudioguideList(): Observable<any[]> {
    return this.firebase.list('audioguides').snapshotChanges();
  }

  getAudioguideListByLocation(idLocation: string): Observable<any[]> {
    return this.firebase.list('audioguides', query => query.orderByChild('idLocation').equalTo(idLocation)).snapshotChanges();
  }

  getAudioguide(idAudioguide: string) {
    return this.firebase.object(`audioguides/${idAudioguide}`)
  }

  searchGuides(start, end): AngularFireList<Audioguide> {
    return this.firebase.list('audioguides', query => query.orderByChild('title').startAt(start).endAt(end));
  }

  addAudioguide(audioguide: Audioguide) {
    return this.firebase.object('audioguides').set(audioguide);
  }
}