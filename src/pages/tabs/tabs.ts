import { IonicPage } from 'ionic-angular';
import { Component } from '@angular/core';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHome = 'HomePage';
  tabMyguides = 'MyguidesPage';
  tabWalk= 'DiscoverPage';
  tabSettings = 'SettingsPage';

  constructor() {

  }
}
