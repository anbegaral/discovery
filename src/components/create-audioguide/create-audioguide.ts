import { TranslateService } from '@ngx-translate/core';
import { SqliteServiceProvider } from './../../providers/sqlite-service/sqlite-service';
import { FilesServiceProvider } from './../../providers/files-service/files-service';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Audioguide, Upload, Location, Country } from './../../model/models';
import { FirebaseServiceProvider } from './../../providers/firebase-service/firebase-service';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'create-audioguide',
  templateUrl: 'create-audioguide.html'
})
export class CreateAudioguideComponent {
  audioguide: Audioguide = new Audioguide();
  idAuthor: string = null;
  currentUpload: Upload;
  storageImageRef: any;
  url: string = null;

  @ViewChild('title') title:string;
  @ViewChild('description') description:string;
  @ViewChild('price') price:number;
  @ViewChild('lang') lang:string;
  @ViewChild('country') country: string;
  @ViewChild('location') location:string;
  @ViewChild('idlocation') idlocation:string;
  @ViewChild('image') image: File;
  showInputs: boolean = false;
  showLocationInput: boolean = false;

  createAudioguideForm: FormGroup;

  constructor(public navCtrl: NavController, 
    public formBuilder: FormBuilder, 
    private firebaseService: FirebaseServiceProvider, 
    private storage: Storage,
    private filesService: FilesServiceProvider,
    private sqliteService: SqliteServiceProvider,
    private translateService: TranslateService) {

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
    console.log(this.storage.get('useremail'))
    
    this.storage.get('useremail').then(useremail => {
      console.log(useremail)
      
      this.firebaseService.getUsers({
      orderByChild: 'email',
      equalTo: useremail
        }).subscribe(idAuthor => {
          console.log(idAuthor)
          this.idAuthor = idAuthor[0].$key
          this.storage.set('idAuthor', this.idAuthor)
        })})
    .catch(error => console.log(error))
  }

  getLocation($event?) {
    console.log($event)    
    this.location = $event
  }

  openInput($event?) {
    this.showInputs = $event;
    this.showLocationInput = false;    
  }

  creatingLocationEvent($event) {
    this.showLocationInput = $event.event;
    this.country = $event.idcountry
  }

  detectFile(event) {
    this.image = event.target.files[0];
  }

  uploadFile() {
    this.currentUpload = new Upload(this.image);
    return this.filesService.uploadFile('images', this.currentUpload).then(url => {
      return this.audioguide.imageUrl =  url
    })
  }

  createAudioguide() {
    if(this.idAuthor === null) {
      this.navCtrl.push('RegisterContributorPage')
      return
    }
    if(!this.showInputs) {
      this.audioguide.idLocation = this.location;
    } else {
      this.createLocation()
      this.audioguide.idLocation = this.location;      
    } 
    this.audioguide.title = this.title;
    this.audioguide.description = this.description;
    this.audioguide.lang = this.lang;
    this.audioguide.price = this.price; 
    this.audioguide.image = 'images/'+this.image.name;
    this.audioguide.imageUrl = this.image.name;
    this.sqliteService.createAudioguide(this.audioguide).then(() => this.navCtrl.push('MyguidesPage'))
    
    this.audioguide = new Audioguide()
  }

  createLocation() {
    this.firebaseService.getCountry(this.country).subscribe(idCountry => {
      if(idCountry.$key === this.country && idCountry.$value !== null && idCountry.$value !== 'undefined') {
        let newLocation = new Location();
          newLocation.idCountry = this.country;
          newLocation.language = [{code: this.translateService.getDefaultLang(), name: this.location}];
          this.firebaseService.addLocation(newLocation).then(idLocation => {
            this.idlocation = idLocation;
            
          });
      } else {
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
  }

  completeAudioguide() {

    this.uploadFile().then(() => {
      this.audioguide.reviewed = false;
      this.audioguide.idAuthor = this.idAuthor;
      if(!this.showInputs) {
        this.audioguide.idLocation = this.location;
      } else {
        // this.firebaseService.addCountry(this.country)
      }
      this.audioguide.title = this.title;
      this.audioguide.description = this.description;
      this.audioguide.lang = this.lang;
      this.audioguide.price = this.price; 
      this.audioguide.image = 'images/'+this.image.name;
      
      // this.firebaseService.createAudioguide(this.audioguide).then(key => this.createAudioguideToSqlite(key))
    });
    
    this.audioguide = new Audioguide()
  }

  // getImageUrl(fileName: string) {
  //   this.storageImageRef = firebase.storage().ref().child(fileName);
  //   return this.storageImageRef.getDownloadURL().then(url => {
  //     console.log(url)
  //     return url
  //   })
  // }
}
