import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseListObservable } from 'angularfire2/database';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController, ActionSheetController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-myguides',
  templateUrl: 'myguides.html',
})
export class MyguidesPage {

  songs: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, 
      public navParams: NavParams, 
      private alertCtrl: AlertController, 
      private afDB: AngularFireDatabase, 
      public actionSheetCtrl: ActionSheetController) {
    this.songs = this.afDB.list('/audioguides');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyguidesPage');
  }

  addSong(){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Enter a name for this new song you're so keen on adding",
      inputs: [
        {
          name: 'En',
          placeholder: 'Country name'
        },
        {
          name: 'Es',
          placeholder: 'Country name'
        },{
          name: 'Fr',
          placeholder: 'Country name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songs.push({
              idLocation: '-Ktqkb-kCiwJh3cQ9uoK',
              title: "Madrid de museos",
              image: "madrid_640x480.jpg",
              lang: "es",
              idAuthor: "author2",
              pois: 7,
              price: 2.95,
              description: " texto largo",
              duration: 50
            });
          }
        }
      ]
    });
    prompt.present();
  }

  showOptions(songId, songTitle) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'What do you want to do?',
      buttons: [
        {
          text: 'Delete Song',
          role: 'destructive',
          handler: () => {
            this.removeSong(songId);
          }
        },{
          text: 'Update title',
          handler: () => {
            this.updateSong(songId, songTitle);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  removeSong(songId: string){
    this.songs.remove(songId);
  }

  updateSong(songId, songTitle){
    let prompt = this.alertCtrl.create({
      title: 'Song Name',
      message: "Update the name for this song",
      inputs: [
        {
          name: 'title',
          placeholder: 'Title',
          value: songTitle
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.songs.update(songId, {
              title: data.title
            });
          }
        }
      ]
    });
    prompt.present();
  }
}
