import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  isPlaying: boolean = false;
  volume: number = 50;

  togglePlayback(): void {
    this.isPlaying = !this.isPlaying;
    // Add logic to play/pause music
  }

  previousSong(): void {
    // Add logic to play previous song
  }

  nextSong(): void {
    // Add logic to play next song
  }

  changeVolume(): void {
    // Add logic to change volume
  }
}
