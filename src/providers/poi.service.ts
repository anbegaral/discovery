import { POI } from './../model/models';
import { AngularFireList, AngularFireDatabase } from "angularfire2/database";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class PoiService {
  selectedPoi: POI = new POI();

  constructor(private firebase : AngularFireDatabase ) { }
 
  getPoiList(idAudioguide: string): Observable<any[]> {
    return this.firebase.list('poi', query => query.orderByChild('idAudioguide').equalTo(idAudioguide)).snapshotChanges();
  }

}