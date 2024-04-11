import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Renderer2, ElementRef, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  constructor(
    private router: Router,
    private http: HttpClient,
    private el: ElementRef,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef
  ) { }
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  // Other variables
  circlePosition: number = 0;
  currentTime: string = '0:00';
  totalTime: string = '0:00';
  isPlaying: boolean = false;
  // currentMusic: string = 'https://www.pagalworld.com.cm/files/download/id/70543';
  currentMusic: any;
  currentMusicName: any;
  currentArtistName: string = '';
  songDuration: any;


  
  // Define variables for the audio player and buttons
  audioPlayer!: HTMLAudioElement;
  playButton!: HTMLImageElement;
  nextButton!: HTMLImageElement;
  previousButton!: HTMLImageElement;


  playPauseSrc = 'assets/play.svg';
  playbuttonSrc = 'assets/play.svg';
  pauseButtonSrc = 'assets/pause.svg';
  playBt: any;
  closeVolume: any = 'assets/closevolume.svg';
  volumeIcon: string = 'assets/volume.svg';
  isMuted: boolean = false;
  // Define variables for the circle position and total duration of the song

  // card variables
  albums: any[] = [];
  songs: any[] = [];


    // Assuming you have a property to track the currently playing song
  currentSong: any;

  ngOnInit() {
    // const mobileNumber = localStorage.getItem('mobileNumber') as string | null;
    if (!localStorage.getItem('mobileNumber')) {
      window.location.href = '/login';
    }
    this.getAll();
  }

  getAll() {
    this.loginService.getAllAlbum().subscribe((res: any) => {
      this.albums = res.data;
      console.log(res.data, "albumData==========")
      this.cdr.detectChanges();
      if (this.albums.length > 0) {
        this.songsByAlbumId(this.albums[0].albumId);
      }
    })
  };

  songsByAlbumId(albumId: any) {
    this.loginService.songsByAlbumId(albumId).subscribe((res: any) => {
      this.songs = res.data;
      console.log(res.data, "res.data=========")

    })
  }

  ngAfterViewInit() {
    // Initialize audio player
    this.audioPlayer = this.audioPlayerRef.nativeElement;
  
    // Add event listener for updating seek bar
    this.audioPlayer.addEventListener('timeupdate', () => {
      this.updateSeekBar();
    });
  
    // Add event listeners for play, pause, and error events
    this.audioPlayer.addEventListener('play', () => {
      this.playPauseSrc = this.pauseButtonSrc;
      this.cdr.detectChanges();
    });
  
    this.audioPlayer.addEventListener('pause', () => {
      this.playPauseSrc = this.playbuttonSrc;
      this.cdr.detectChanges();
    });
  
    this.audioPlayer.addEventListener('error', (event) => {
      console.error('Error occurred while playing the audio:', event);
      // Handle error gracefully
    });
  }
  
  



// Inside your component class

  // Update seek bar and current time
  updateSeekBar() {
    if (this.audioPlayer) {
      const currentTime = this.audioPlayer.currentTime;
      let duration = this.audioPlayer.duration;
      if (isNaN(duration)) {
        duration = 0;
      }
      const progress = (currentTime / duration) * 100;
  
      this.currentTime = this.formatTime(currentTime);
      this.totalTime = this.formatTime(duration);
      this.circlePosition = progress;
    }
  }
  


  // Format time as mm:ss
  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  adjustSong(event: MouseEvent) {
    if (this.audioPlayer && event.target instanceof HTMLElement) {
      const seekBarWidth = event.target.clientWidth;
      const clickX = event.clientX - event.target.getBoundingClientRect().left;
      const percentage = (clickX / seekBarWidth) * 100;
      const newTime = (percentage / 100) * this.audioPlayer.duration;
      this.audioPlayer.currentTime = newTime;
      this.circlePosition = percentage;
      this.currentTime = this.formatTime(newTime);
    }
  }
  
  





  adjustVolume(event: Event) {
    const volumeLevel = (event.target as HTMLInputElement).value;
    console.log('Volume level:', volumeLevel);
    if (this.audioPlayer) {
      const normalizedVolume = parseFloat(volumeLevel) / 100;
      this.audioPlayer.volume = normalizedVolume;
    }
  }


  togglePlay() {
    if (this.audioPlayer && this.audioPlayer.src) {
      // Check if the audio source is set
      if (this.audioPlayer.readyState >= 2) {
        // Check if the audio is loaded
        if (this.audioPlayer.paused) {
          this.audioPlayer.play();
        } else {
          this.audioPlayer.pause();
        }
      } else {
        console.warn('Audio is still loading.');
      }
    } else {
      console.warn('Audio source is not set.');
    }
  }
  
  
  

  playSongongById(song: any) {
    console.log("playSongongById====", song);
  
    this.currentMusic = song.songUrl;
    this.currentMusicName = song.songTitle;
    this.currentArtistName = song.artistName;
    this.songDuration = song.duration;
  
    // Set the new source and wait for it to be ready to play
    this.audioPlayer.src = this.currentMusic;
    this.audioPlayer.load(); // Load the new source
  
    // Add event listener for when the new source is ready to play
    this.audioPlayer.addEventListener('canplaythrough', () => {
      // Play the song when it's ready
      this.audioPlayer.play();
      // Update the play/pause button icon
      this.playPauseSrc = this.pauseButtonSrc;
      this.cdr.detectChanges();
    });
  
    // Handle errors
    this.audioPlayer.addEventListener('error', (event) => {
      console.error('Error occurred while loading the audio:', event);
      // Handle error gracefully
    });
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
  if (this.songs.length === 0) return; // No songs available
  const currentIndex = this.songs.findIndex(song => song.songUrl === this.currentMusic);
  let nextIndex = currentIndex + 1;
  if (nextIndex >= this.songs.length) {
    nextIndex = 0; // Loop back to the first song if reaching the end
  }
  const nextSong = this.songs[nextIndex];
  this.playSongongById(nextSong);
}

// Function to play the previous song
previousSong() {
  if (this.songs.length === 0) return; // No songs available
  const currentIndex = this.songs.findIndex(song => song.songUrl === this.currentMusic);
  let prevIndex = currentIndex - 1;
  if (prevIndex < 0) {
    prevIndex = this.songs.length - 1; // Loop back to the last song if reaching the beginning
  }
  const prevSong = this.songs[prevIndex];
  this.playSongongById(prevSong);
}


  loginForm() {
    this.router.navigate(['/login']);

  }

  signOutForm() {
    // Remove the mobile number from localStorage
    localStorage.removeItem('mobileNumber');
    window.location.href = '/login';

    const mobileNumber = localStorage.getItem('mobileNumber') as string | null;
    if (!mobileNumber) {
      window.location.href = '/login';
    }
  }

  adminMenueToggle() {
    this.router.navigate(['/admin']);
  }





}
