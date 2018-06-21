import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Audioguide, Location } from '../../model/models';
import { AudioguideService } from '../../providers/audioguide.service';

@IonicPage()
@Component({
  selector: 'page-list-guides',
  templateUrl: 'list-guides.html',
})
export class ListGuidesPage {
  location: Location = null;
  locationName: string;
  audioguides: Audioguide[] = [];
  loader: any;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private audioguideService: AudioguideService,
    private loadingCtrl: LoadingController ) {
      this.location = this.navParams.data;
      this.locationName = this.location.locationName;
      this.getAudioguides();
  }

  getAudioguides() {
    let idLocation = this.location.key;
    
    this.loader = this.loadingCtrl.create({
      content: `Loading audioguides...`
    });
    this.loader.present();
    this.audioguideService.getAudioguideListByLocation(idLocation).subscribe(audioguides => {
      this.audioguides = audioguides
      this.audioguides.forEach(audioguide => {
        this.audioguideService.getPoiList(audioguide.key).subscribe(pois => {
          audioguide.audioguidePois = pois;
        });
      })
    });
    this.loader.dismiss();
  }

  viewGuide(audioguide: Audioguide) {
    this.navCtrl.push('ViewGuidePage', audioguide);
  }
}
