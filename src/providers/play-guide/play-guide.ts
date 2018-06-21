import { Injectable } from '@angular/core';
import { MediaObject, Media } from '@ionic-native/media';
import { FirebaseApp } from 'angularfire2';
import { File } from '@ionic-native/file';
import { LoadingController, Platform } from 'ionic-angular';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: "root"
})
export class PlayGuideProvider {
  mediaFile: MediaObject;
  storageRef: any;
  fileUrl: string;
  public isPlaying = new Subject();
  position: number = 0;
  storageDirectory: any;

  constructor(private media: Media,
    private firebaseStorage: FirebaseApp,
    private loadingCtrl: LoadingController,
    private file: File,
    private platform: Platform) {
      
      this.platform.ready().then(() => {
        if(this.platform.is('ios')) {
          this.storageDirectory = this.file.dataDirectory;
        } else if(this.platform.is('android')) {
          this.storageDirectory = this.file.externalDataDirectory;
        }
      });
  }

  listenStreaming(fileName) { 
    let loading = this.loadingCtrl.create({
      content: 'Loading the audioguide...'
    });
    loading.present(); 
    
    this.storageRef = this.firebaseStorage.storage().ref().child(fileName);
    this.storageRef.getDownloadURL().then(url => {
      this.fileUrl = url;
      this.mediaFile = this.media.create(this.fileUrl);

      this.mediaFile.onStatusUpdate.subscribe(status => {
        console.log(status)
        
        if(this.media.MEDIA_RUNNING === status){
          console.log(`MEDIA_RUNNING status `+status)          
          this.mediaFile.seekTo(this.position*1000);
        }

        if(this.media.MEDIA_STARTING === status) {
          console.log(`MEDIA_STARTING status `+status)
        }

        if(this.media.MEDIA_ERR_DECODE === status) {
          console.log(`MEDIA_ERR_DECODE status `+status)
          this.isPlaying.next(false);  
        }

        if(this.media.MEDIA_STOPPED === status){  
          this.isPlaying.next(false);
        }
      }); // fires when file status changes
      
      this.mediaFile.onSuccess.subscribe(() => {
        console.log('Action is successful')
      });
      
      this.mediaFile.onError.subscribe(error => console.log('Error!', error.toString()));
      loading.dismiss();      
      this.mediaFile.play();
      this.isPlaying.next(true); 
    }).catch(error =>
    {
      loading.dismiss();      
      // this.utils.handlerError(err);
      console.log(error.message.toString())      
    });
  }

  listen(fileName){ 
    let loading = this.loadingCtrl.create({
      content: 'Loading the audioguide...'
    });
    loading.present(); 

    this.mediaFile = this.media.create(this.storageDirectory + fileName);
    this.mediaFile.onStatusUpdate.subscribe(status => {
      console.log(status)
      if(this.media.MEDIA_RUNNING === status){
        console.log(`MEDIA_RUNNING `+status)
        this.isPlaying.next(true);
        this.mediaFile.seekTo(this.position*1000);
      }

      if(this.media.MEDIA_STARTING === status) {
        this.isPlaying.next(true);
        console.log(`MEDIA_STARTING status `+status)
      }

      if(this.media.MEDIA_ERR_DECODE === status) {
        console.log(`MEDIA_ERR_DECODE status `+status)
        this.isPlaying.next(false);        
      }

      if(this.media.MEDIA_STOPPED === status){        
        this.isPlaying.next(false);
      }
    }); // fires when file status changes
    
    this.mediaFile.onSuccess.subscribe(() => {
      console.log('Action is successful')
    });
    
    this.mediaFile.onError.subscribe(error => console.log('Error!', error.toString()));
    loading.dismiss();      
    this.mediaFile.play();
    this.isPlaying.next(true);
  }

  pause() {    
    this.mediaFile.pause();
    this.mediaFile.getCurrentPosition().then(position => this.position = position)
    this.isPlaying.next(false);
  }

  stop() {
    this.mediaFile.stop();
    this.mediaFile.release();
    this.position = 0;
    this.isPlaying.next(false);
  }

  startRecord(poiName: string) {
    this.file.createFile(this.storageDirectory, poiName, true).then(() => { 
      if (this.platform.is('ios')) {  //ios
        this.mediaFile = this.media.create(this.storageDirectory.replace(/^file:\/\//, '') + poiName);
      } else {  // android
        this.mediaFile =  this.media.create(this.storageDirectory + poiName);
      }
      this.mediaFile.startRecord();
    })
  }

  stopRecord() {
    this.mediaFile.stopRecord();
  }

}
