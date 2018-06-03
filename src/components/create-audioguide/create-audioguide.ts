import { TranslateService } from '@ngx-translate/core';
import { SqliteServiceProvider } from './../../providers/sqlite-service/sqlite-service';
import { FilesServiceProvider } from './../../providers/files-service/files-service';
import { NavController, Platform, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Audioguide, Upload, Location, Country } from './../../model/models';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { FilePath } from '@ionic-native/file-path';

@Component({
  templateUrl: 'create-audioguide.html'
})
export class CreateAudioguideComponent {
  audioguide: Audioguide = new Audioguide();
  idAuthor: string = null;
  currentUpload: Upload;
  storageImageRef: any;
  url: string = null;
  lastImage: string = '';
  storageDirectory: any;
  pictureName: string = null;

  @ViewChild('title') title:string;
  @ViewChild('description') description:string;
  @ViewChild('price') price:number;
  @ViewChild('lang') lang:string;
  @ViewChild('country') country: string;
  @ViewChild('location') location:string;
  @ViewChild('idlocation') idlocation:string;
  @ViewChild('image') image: any;
  showInputs: boolean = false;
  showLocationInput: boolean = false;

  createAudioguideForm: FormGroup;

  constructor(public navCtrl: NavController, 
    public formBuilder: FormBuilder, 
    private firebaseService: FirebaseServiceProvider, 
    private storage: Storage,
    private filesService: FilesServiceProvider,
    private sqliteService: SqliteServiceProvider,
    private translateService: TranslateService,
    private file: File,
    private platform: Platform,
    private camera: Camera,
    private filePath: FilePath,
    public viewCtrl: ViewController
  ) {

    this.createAudioguideForm = formBuilder.group({
      title: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      description: ['', Validators.compose([Validators.maxLength(250), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      price: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      lang: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      country: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      location: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      idlocation: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      image: ['', Validators.compose([Validators.maxLength(20), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
    });
    
    this.storage.get('idAuthor').then(idAuthor => {
      console.log('idAuthor ' +idAuthor)
      this.idAuthor = idAuthor;
    });

    this.platform.ready().then(() => {
      if(this.platform.is('ios')) {
        this.storageDirectory = this.file.dataDirectory;
      } else if(this.platform.is('android')) {
        this.storageDirectory = this.file.dataDirectory;
      } else {
        // exit otherwise, but you could add further types here e.g. Windows
        return false;
      }
    });
  }

  getLocation($event?) {  
    this.location = $event
  }

  openInput($event?) {
    this.showInputs = $event;
    this.showLocationInput = false;    
  }

  creatingLocationEvent($event) {
    this.showLocationInput = $event.event;
    this.country = $event.idcountry;
  }

  uploadFile() {
    this.currentUpload = new Upload(this.image);
    return this.filesService.uploadFile('images', this.currentUpload).then(url => {
      return this.audioguide.imageUrl = url
    }).catch(error => {
      return error
    })
  }

  // create the audioguide on local
  createAudioguide() {

    if(!this.showInputs) {
      this.audioguide.idLocation = this.location;
    } else {
      // if the location does not exist we need to create it
      this.createLocation()
      this.audioguide.idLocation = this.location;      
    } 

    this.audioguide.idAuthor = this.idAuthor;
    this.audioguide.title = this.title;
    this.audioguide.description = this.description;
    this.audioguide.lang = this.lang;
    this.audioguide.price = this.price;
    console.log(this.audioguide);
    this.sqliteService.createAudioguide(this.audioguide).then(() => {
      this.modalDismiss();
      alert('Audioguide created succesfully');
      this.navCtrl.push('MyguidesPage', {
        myguidesSegment: 'created'
      })
    }).catch(error => console.log(error))    
    
    // reset the audioguide object
    this.audioguide = new Audioguide()
  }

  modalDismiss() {
    this.viewCtrl.dismiss();
  }

  // Copy the image to a local folder
  copyFileToLocalDir(filePath, currentName) {
    this.audioguide.image = currentName;        
    this.file.copyFile(filePath, currentName, this.storageDirectory, currentName).then(success => {
      this.pictureName = currentName;
    }, error => {
      console.log('Error while storing file.' + error.message);
    });
  }

  takePicture() {
    var options = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imagePath) => {
      if (this.platform.is('android')) {
        this.filePath.resolveNativePath(imagePath).then(filePath => {
            var sourceDirectory = filePath.substring(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(sourceDirectory, currentName);
          });
      } else {
        /* TODO*/
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.audioguide.image = currentName;
        this.copyFileToLocalDir(correctPath, currentName);
      }
    }, (err) => {
      console.log('Error while selecting image.');
    });
  }

  createLocation() {
    this.firebaseService.getCountry(this.country).valueChanges().subscribe(country => {
      console.log(country)   
      if(country.$key === this.country && country.language !== null) {
        let newLocation = new Location();
          newLocation.idCountry = this.country;
          newLocation.language = [{code: this.translateService.getDefaultLang(), name: this.location}];
          this.firebaseService.addLocation(newLocation).then(idLocation => {
            this.idlocation = idLocation;
            
          });
      } else {
    // if the country does not exist        
        let newCountry = new Country();
        newCountry.language = [{code: this.translateService.getDefaultLang(), name: this.country}];
        this.firebaseService.addCountry(newCountry).then(idCountry => {
          let newLocation = new Location();
          newLocation.idCountry = idCountry;
          newLocation.language = [{code: this.translateService.getDefaultLang(), name: this.location}]
          this.firebaseService.addLocation(newLocation).then(idLocation => {
            this.idlocation = idLocation;
          });
        });
      }
    })
    // if the country already exists   
  }

  // completeAudioguide() {
  //   // add the audioguide to firebase
  //   this.uploadFile().then(() => {
  //     this.audioguide.reviewed = false;
  //     this.audioguide.idAuthor = this.idAuthor;
  //     if(!this.showInputs) {
  //       this.audioguide.idLocation = this.location;
  //     } else {
  //       // this.firebaseService.addCountry(this.country)
  //     }
  //     this.audioguide.title = this.title;
  //     this.audioguide.description = this.description;
  //     this.audioguide.lang = this.lang;
  //     this.audioguide.price = this.price; 
  //     this.audioguide.image = 'images/'+this.image.name;
      
  //     // this.firebaseService.createAudioguide(this.audioguide).then(key => this.createAudioguideToSqlite(key))
  //   });
    
  //   this.audioguide = new Audioguide()
  // }

  // getImageUrl(fileName: string) {
  //   this.storageImageRef = firebase.storage().ref().child(fileName);
  //   return this.storageImageRef.getDownloadURL().then(url => {
  //     console.log(url)
  //     return url
  //   })
  // }
}
