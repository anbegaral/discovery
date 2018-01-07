import { Component, Input } from '@angular/core';
import { PlayGuideProvider } from '../../providers/play-guide/play-guide';

@Component({
  selector: 'accordion',
  templateUrl: 'accordion.html'
})
export class AccordionComponent {

  @Input('elements') elements: any;
  isPlaying: any = false; 

  constructor(private playService: PlayGuideProvider) {
  }

  listen(filename){
    this.playService.listenStreaming(filename)
    this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying)
  }

  pause() { 
    this.playService.pause()
    this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying)
  }

  stop() {
    this.playService.stop()
    this.playService.isPlaying.subscribe(isPlaying => this.isPlaying = isPlaying)
  }
}
