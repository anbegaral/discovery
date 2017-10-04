import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

@Injectable()
export class FilesServiceProvider {
  storageDirectory: any;

  constructor(private platform: Platform, private file: File, private transfer: FileTransfer) {
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

  
  downloadFile(url, filename) {
    console.log(url , filename)
      return this.file.resolveDirectoryUrl(this.storageDirectory)
      .then((resolvedDirectory) => {
        console.log("resolved  directory: " + resolvedDirectory.nativeURL);

        return this.file.checkFile(resolvedDirectory.nativeURL, filename)
        .then((data) => {
          console.log('File already exist ' + data)
          return null; 
        })
        .catch(err => {
          console.log("Error occurred while checking local files:");
          console.log(err);
          if(err.code == 1) {
            const fileTransfer: FileTransferObject = this.transfer.create();
            return fileTransfer.download(url, this.storageDirectory + filename)
              .then(entry => {
                console.log('download complete ' + entry.toURL());
                return entry;
              })
              .catch(err_2 => {
                console.log("Download error!");
                console.log(err_2);
              });
          }
        });
      });
  }

  deleteFile(fileName) {
    this.file.removeFile(this.storageDirectory, fileName)
      .then(() => console.log(`File ` + fileName + ` deleted`))
      .catch(err => {
        console.log("Error occurred while deleting local files:");
        console.log(err);
    })
  }
}
