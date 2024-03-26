import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Renderer2, ElementRef,ViewChild } from '@angular/core';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  constructor(private router: Router,
    private http: HttpClient,
    private el: ElementRef
    ) {}
    @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
      // Other variables
  circlePosition: number = 0;
  currentTime: string = '0:00';
  totalTime: string = '0:00';
  isPlaying: boolean = false;
  currentMusic: string = 'https://www.pagalworld.com.cm/files/download/id/70543';

    playPauseSrc = 'assets/play.svg';
    playbuttonSrc = 'assets/play.svg';
    pauseButtonSrc = 'assets/pause.svg';
    playBt: any;
    closeVolume: any = 'assets/closevolume.svg';
    volumeIcon: string = 'assets/volume.svg';
    isMuted: boolean = false;
  // Define variables for the circle position and total duration of the song


  loginForm() {
    this.router.navigate(['/login']);
  }


  // Define variables for the audio player and buttons
  audioPlayer!: HTMLAudioElement;
  playButton!: HTMLImageElement;
  nextButton!: HTMLImageElement;
  previousButton!: HTMLImageElement;


  ngOnInit() {
    // Call the updateSeekBar method when component initializes
    // this.updateSeekBar();

      // Call the updateSeekBar method when component initializes
      // this.updateSeekBar(event: any);
  }

  // Update seekbar and time display
  updateSeekBar(event: Event) {
    debugger;
    const audioPlayer = this.audioPlayerRef.nativeElement;
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    this.circlePosition = (currentTime / duration) * 100;

    // Format time display
    this.currentTime = this.formatTime(currentTime);
    this.totalTime = this.formatTime(duration);
  }


  // Format time as mm:ss
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  adjustVolume(event: Event) {
    const volumeLevel = (event.target as HTMLInputElement).value;
    console.log('Volume level:', volumeLevel);
  if (this.audioPlayer) {
    const normalizedVolume = parseFloat(volumeLevel) / 100;
    this.audioPlayer.volume = normalizedVolume;
  }
  }


  ngAfterViewInit() {
    const volumeRange = this.el.nativeElement.querySelector('#volumeRange');
    const updateVolume = () => {
      const volumeLevel = parseInt(volumeRange.value);
      console.log('Volume level:', volumeLevel);
    };
    updateVolume();
    volumeRange.addEventListener('input', updateVolume);

    // Initialize variables with the corresponding elements
    this.audioPlayer = document.getElementById('audioPlayer') as HTMLAudioElement;
    this.playButton = document.getElementById('play') as HTMLImageElement;
    this.nextButton = document.getElementById('next') as HTMLImageElement;
    this.previousButton = document.getElementById('previous') as HTMLImageElement;


    // Add event listeners only if the elements exist
    if (this.playButton) {
      this.playButton.addEventListener('click', this.togglePlay.bind(this));
    }
    if (this.nextButton) {
      this.nextButton.addEventListener('click', this.nextSong.bind(this));
    }
    if (this.previousButton) {
      this.previousButton.addEventListener('click', this.previousSong.bind(this));
    }
  }

// Function to toggle play/pause
togglePlay() {
  if (this.audioPlayer) {
    if (this.audioPlayer.paused) {
      this.audioPlayer.play();
      console.log(this.playButton.src, "this.playButton.src");
      this.playPauseSrc = this.pauseButtonSrc;
    } else {
      this.audioPlayer.pause();
      console.log(this.playPauseSrc, "this.playButton.src");
      this.playPauseSrc = this.playbuttonSrc;
    }
  }
}

  toggleVolume() {
    if (this.audioPlayer) {
      if (this.isMuted) {
        this.audioPlayer.volume = 1;
        this.volumeIcon = 'assets/volume.svg';
      } else {
        this.audioPlayer.volume = 0;
        this.volumeIcon = 'assets/mute.svg';
      }
      this.isMuted = !this.isMuted;
    }
  }



  // Function to play the next song
  nextSong() {
    // Add your logic to play the next song
  }

  // Function to play the previous song
  previousSong() {
    // Add your logic to play the previous song
  }
}
