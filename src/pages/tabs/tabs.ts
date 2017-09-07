import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { MyguidesPage } from "../myguides/myguides";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHome = HomePage;
  tabMyguides = MyguidesPage;
  tabWalk= AboutPage;
  tabSettings = ContactPage;

  constructor() {

  }
}
