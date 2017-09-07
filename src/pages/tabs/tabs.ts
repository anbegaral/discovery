import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { MyguidesPage } from "../myguides/myguides";
import { DiscoverPage } from "../discover/discover";
import { SettingsPage } from "../settings/settings";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHome = HomePage;
  tabMyguides = MyguidesPage;
  tabWalk= DiscoverPage;
  tabSettings = SettingsPage;

  constructor() {

  }
}
