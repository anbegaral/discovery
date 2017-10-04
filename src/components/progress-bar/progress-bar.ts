import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input('progress') progress: number = 0;

  constructor() {
    console.log(`progress `+ this.progress)
    let interval = setInterval(() => {
      this.progress++;
      if (this.progress == 100) {
        clearInterval(interval);
      }
    }, 10);
  }

  
}
