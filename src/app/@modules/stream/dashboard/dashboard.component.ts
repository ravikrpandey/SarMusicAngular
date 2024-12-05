import { Component, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Renderer2, ElementRef, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { FormControl } from '@angular/forms';
export const SERVER_API_URL = environment.serverUrl;
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements AfterViewInit {
  likedSongs: any;
  searchKey: string = '';
  searchResults: any[] = [];
  searchControl = new FormControl(); // Use FormControl with debounce

  constructor(
    private router: Router,
    private http: HttpClient,
    private el: ElementRef,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private renderer: Renderer2
  ) {    
    // Set up debounce on searchControl
    this.searchControl.valueChanges
      .pipe(debounceTime(500))  // Wait for 500 ms of inactivity
      .subscribe(value => {
        this.masterSearch(value);
      });
 }
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  // Other variables
  circlePosition: number = 0;
  currentTime: string = '0:00';
  totalTime: string = '0:00';
  isPlaying: boolean = false;
  currentMusic: any;
  currentMusicName: any;
  currentArtistName: string = '';
  songDuration: any;
  songId: any;
  showLikedSongs: boolean = false;
  type: any = ''
  abbumIdPlay: any;
  showSearch: boolean = false;
  mobileNumber: any;
  mostPlayedSongs: any;
  populatArtist: any;

  // Define variables for the audio player and buttons
  audioPlayer!: HTMLAudioElement;
  playButton!: HTMLImageElement;
  nextButton!: HTMLImageElement;
  previousButton!: HTMLImageElement;

  // Define variables
  lastScrollTop = 0;
  spotifyPlaylists: HTMLElement | null = null;


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
  showSongList = false;
  haveMostPlayed = false;
  

  ngOnInit() {
    this.mobileNumber = localStorage.getItem('mobileNumber') as string | null;
    this.type = localStorage.getItem('type') as string | null;
    this.getAll();
    this.getMostPlayedSongsByUser();
    this.getAllPopularArtist();

  }

  
  masterSearch(searchKey: string) {
    if (searchKey.trim()) {
      this.loginService.masterSearch(searchKey).subscribe(
        (response) => {
          if (response.code === 200) {
            this.searchResults = response.data; 
            console.log("searchResults",this.searchResults)
          } else {
            this.searchResults = []; // Clear results on unsuccessful response
          }
        },
        (error) => {
          console.error('Error fetching search results', error);
          this.searchResults = []; // Clear results on error
        }
      );
    } else {
      this.searchResults = []; // Clear results if search term is empty
    }
  }
  
  

  toggleSongList() {
    this.showSongList = !this.showSongList;
  }

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: type == 'error' ? ['snackbar-error'] : ['snackbar-success'],
      verticalPosition: 'top',
      horizontalPosition: 'right',

    });
  }

  getAll() {
    this.loginService.getAllAlbum().subscribe((res: any) => {
      this.albums = res.data;
      this.cdr.detectChanges();
    })
  };

  


  songsByAlbumId(albumId: any) {
    this.abbumIdPlay = albumId
    this.loginService.songsByAlbumId(albumId).subscribe((res: any) => {
      this.songs = res.data;
      if (this.songs.length > 0 && this.songId == null) {
        this.playSongById(this.songs[0]);
      }
    })
  }

  ngAfterViewInit() {
    // Initialize audio player
    this.audioPlayer = this.audioPlayerRef?.nativeElement;

    // Add event listener for updating seek bar
    this?.audioPlayer?.addEventListener('timeupdate', () => {
      this.updateSeekBar();
    });

    // Add event listeners for play, pause, and error events
    this?.audioPlayer?.addEventListener('play', () => {
      this.playPauseSrc = this.pauseButtonSrc;
      this.cdr.detectChanges();
    });

    this?.audioPlayer?.addEventListener('pause', () => {
      this.playPauseSrc = this.playbuttonSrc;
      this.cdr.detectChanges();
    });

    if (this?.audioPlayer){
    this?.audioPlayer?.addEventListener('error', (event) => {
      // console.error('Error occurred while playing the audio:', event);
      // Handle error gracefully
    });
  }

    // Add event listener for when current song ends
    this?.audioPlayer?.addEventListener('ended', () => {
      // Play the next song
      this.nextSong();
    });

    // Get the element reference
    this.spotifyPlaylists = document.querySelector('.spotifyPlaylists');
  }

  toggleSearchBar() {
    this.showSearch = !this.showSearch;
  }


  // Inside your component class

  // Update seek bar and current time
  updateSeekBar() {
    if (this?.audioPlayer) {
      const currentTime = this?.audioPlayer.currentTime;
      let duration = this?.audioPlayer.duration;
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
    if (this?.audioPlayer && event.target instanceof HTMLElement) {
      const seekBarWidth = event.target.clientWidth;
      const clickX = event.clientX - event.target.getBoundingClientRect().left;
      const percentage = (clickX / seekBarWidth) * 100;
      const newTime = (percentage / 100) * this?.audioPlayer.duration;
      this.audioPlayer.currentTime = newTime;
      this.circlePosition = percentage;
      this.currentTime = this.formatTime(newTime);
    }
  }


  adjustVolume(event: Event) {
    const volumeLevel = (event.target as HTMLInputElement).value;
    if (this?.audioPlayer) {
      const normalizedVolume = parseFloat(volumeLevel) / 100;
      this.audioPlayer.volume = normalizedVolume;
    }
  }


  togglePlay() {
    if (this?.audioPlayer && this?.audioPlayer.src) {
      // Check if the audio source is set
      if (this?.audioPlayer.readyState >= 1) {
        // Check if the audio is loaded
        if (this?.audioPlayer.paused) {
          this?.audioPlayer.play();

        } else {
          this?.audioPlayer.pause();
        }
      } else {
        console.warn('Audio is still loading.');
        this.openSnackBar('Please tap on any card to play song.', 'close', 'error');
      }
    } else {
      console.warn('Audio source is not set.');
      this.openSnackBar('Audio source is not set.', 'close', 'error');
    }
  }


  playSongById(song: any) {
    this.currentMusic = song.songUrl;
    this.currentMusicName = song.songTitle;
    this.currentArtistName = song.artistName;
    this.songDuration = song.duration;
    this.songId = song.songId;
    if (localStorage.getItem('mobileNumber')) {
      this.mobileNumber = localStorage.getItem('mobileNumber');
      this.getMostPlayedSongsByUser();
      this.loginService.increaseSongCount(this.songId, this.mobileNumber).subscribe((res: any) => {

      })
    }

    // Set the new source and wait for it to be ready to play
    this.audioPlayer.src = this.currentMusic;
    this?.audioPlayer.load(); // Load the new source

    // Add event listener for when the new source is ready to play
    this?.audioPlayer?.addEventListener('canplaythrough', () => {
      // Play the song when it's ready
      this?.audioPlayer.play();
      // Update the play/pause button icon
      this.playPauseSrc = this.pauseButtonSrc;
      this.cdr.detectChanges();
    });

    // Handle errors
    this?.audioPlayer?.addEventListener('error', (event) => {
      console.error('Error occurred while loading the audio:', event);
      // Handle error gracefully
    });
  }


  toggleVolume() {
    if (this?.audioPlayer) {
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
    this.playSongById(nextSong);
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
    this.playSongById(prevSong);
  }

  loginForm() {
    this.router.navigate(['/login']);

  }

  signOutForm() {
    // Remove the mobile number from localStorage
    this.authService.logout();
    localStorage.removeItem('mobileNumber');
    window.location.href = '/auth';

    const mobileNumber = localStorage.getItem('mobileNumber') as string | null;

    if (!mobileNumber) {
      window.location.href = '/auth';
    }
  }

  adminMenueToggle() {
    this.router.navigate(['/admin']);
    //   localStorage.removeItem('mobileNumber');
    //  window.location.href = '/auth';
  }

  // =============Likng song=============

  addToLikedSongs(songid: Number, liked: string) {
    let mobileNumber = localStorage.getItem('mobileNumber');
    const likedSongDetails: any = {
      songId: songid,
      playlistName: 'Liked Song',
      playlistId: 1,
      liked: liked,
      mobileNumber: mobileNumber
    }
    this.loginService.addToLikedSongs(likedSongDetails).subscribe((res: any) => {
      if (res) {
        this.openSnackBar(res.message, 'close', 'Success');
      }

    })

  }

  removeFromLikedSongs(songid: Number, liked: string) {
    let mobileNumber = localStorage.getItem('mobileNumber');
    const likedSongDetails: any = {
      songId: songid,
      playlistName: 'Liked Song',
      playlistId: 1,
      liked: liked,
      mobileNumber: mobileNumber
    }
    this.loginService.addToLikedSongs(likedSongDetails).subscribe((res: any) => {
      if (res) {
        this.openSnackBar(res.message, 'close', 'Success');
      }

    })

  }

  toggleLove(song: any) {
    song.liked = !song.liked; // Toggle the liked state
    if (song.liked) {
      // Add the song to the "liked" section or perform any other action
      this.addToLikedSongs(song.songId, song.liked);
    } else {
      // Remove the song from the "liked" section or perform any other action
      this.removeFromLikedSongs(song.songId, song.liked);
    }
  }


  toggleLibrary() {
    this.showLikedSongs = !this.showLikedSongs;
  }


  getMostPlayedSongsByUser(): void {
    this.loginService.getMostPlayed(this.mobileNumber).subscribe(
      (res: any) => {
        if (res?.mostPlayed) {
          // Collect all songs arrays from `mostPlayed` and assign to `this.songs`
          this.haveMostPlayed = true;
          this.mostPlayedSongs = res.mostPlayed.reduce((acc: any[], pl: any) => acc.concat(pl.songs), []);
        } else {
          console.warn('No songs found for this user.');
          this.mostPlayedSongs = [];
        }
      },
      (error) => {
        console.error('Error fetching most played songs:', error);
      }
    );
  }

  getAllPopularArtist(): void {    this.loginService.getAllPopularArtist().subscribe(
      (res: any) => {
        if (res?.data) {
          this.populatArtist = res.data;
          this.cdr.detectChanges();
        } else {
          console.warn('No songs found for this user.');
        }
      },
      (error) => {
        console.error('Error fetching most played songs:', error);
      }
    );
  }

  songsByArtistId(artistId: any): void {  
    debugger 
     this.loginService.songsByArtistId(artistId).subscribe((res:any) => {
      if (res.data.length > 0) {
        this.songs = res.data;
        if (this.songs.length > 0) {
          this.playSongById(this.songs[0]);
        }
      }

    })

  }

  getLikedSongByUser() {
    if (this.mobileNumber) {
      this.loginService.getLikedSongByUser(this.mobileNumber).subscribe((response: any) => {
        if (response) {
          this.songs = response.data
          this.searchResults = [];
        }
      })

    }
  }

};


