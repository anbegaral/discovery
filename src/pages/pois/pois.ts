import { SqliteServiceProvider } from './../../providers/sqlite-service/sqlite-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-pois',
  templateUrl: 'pois.html',
})
export class PoisPage {

  pois: any;
  poisList: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private sqliteService: SqliteServiceProvider) {
    this.listPois();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PoisPage');
  }

  listPois() {
    console.log(this.navParams.data)
    this.sqliteService.findPois(this.navParams.data).then(
      (data: any) => {
        console.log(decodeURI(JSON.stringify(data)));
        data.forEach(element => {
          let decodePois = decodeURI(element.pois);
          element.pois = JSON.parse(decodePois);
          this.poisList = element.pois;
        });
    }).catch(
      (error) => console.log(error.message.toString())
    );
  }

}
