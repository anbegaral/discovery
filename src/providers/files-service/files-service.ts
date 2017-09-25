import { Platform, LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { MediaObject, Media } from '@ionic-native/media';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@Injectable()
export class FilesServiceProvider {
  storageDirectory: any;

  constructor(private platform: Platform, private media: Media, private file: File, private transfer: FileTransfer, private loadingCtrl: LoadingController) {
    // assign storage directory
    this.platform.ready().then(() => {
      if(this.platform.is('ios')) {
        this.storageDirectory = this.file.dataDirectory;
      } else if(this.platform.is('android')) {
        this.storageDirectory = this.file.externalDataDirectory;
      }
    });
    console.log(this.storageDirectory)
  }

  // createAudioFile(pathToDirectory, filename): MediaObject {
  //   if (this.platform.is('ios')) {  //ios
  //     return this.media.create((pathToDirectory).replace(/^file:\/\//, '') + '/' + filename);
  //   } else {  // android
  //     return this.media.create(pathToDirectory + filename);
  //   } 
  // }

  
  downloadImageFile(url, filename) {
    console.log(url , filename)
    this.platform.ready().then(() => {
      this.file.resolveDirectoryUrl(this.storageDirectory).then((resolvedDirectory) => {
        console.log("resolved  directory: " + resolvedDirectory.nativeURL);
        this.file.checkFile(resolvedDirectory.nativeURL, filename).then((data) => {
          console.log('File already exist ' + data)
           
        }).catch(err => {
          console.log("Error occurred while checking local files:");
          console.log(err);
          if(err.code == 1) {
            // not found! download!
            console.log("not found! download!");
            let loading = this.loadingCtrl.create({
              content: 'Downloading the image from the server...'
            });
            loading.present();
            const fileTransfer: FileTransferObject = this.transfer.create();
            fileTransfer.download(url, this.storageDirectory + filename).then(entry => {
              console.log('download complete ' + entry.toURL());
              loading.dismiss();
            }).catch(err_2 => {
              console.log("Download error!");
              loading.dismiss();
              console.log(err_2);
            });
          }
        });
      });
    });
  }
}
