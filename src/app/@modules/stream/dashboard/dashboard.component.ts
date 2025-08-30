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
declare var YT: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  likedSongs: any;
  searchKey: string = '';
  searchResults: any[] = [];
  searchControl = new FormControl();

  // Volume and loader
  volumePercentage: number = 100;
  isPlayPauseLoading: boolean = false;
 
  constructor(
    private router: Router,
    private http: HttpClient,
    private el: ElementRef,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private renderer: Renderer2,
  ) {
    this.searchControl.valueChanges
      .pipe(debounceTime(500))
      .subscribe(value => {
        this.masterSearch(value);
      });

    // Restore last volume from localStorage if available
    const lastVolume = localStorage.getItem('lastVolume');
    if (lastVolume !== null) {
      const parsed = parseInt(lastVolume, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
        this.volumePercentage = parsed;
      }
    }
  }

  @ViewChild('audioPlayer', { static: false }) audioPlayerRef!: ElementRef<HTMLAudioElement>;
  audioPlayer!: HTMLAudioElement;
  circlePosition: number = 0;
  currentTime: string = '0:00';
  totalTime: string = '5:00';
  isPlaying: boolean = false;
  currentMusic: any;
  currentMusicName: any;
  currentArtistName: string = '';
  songDuration: any;
  songId: any;
  showLikedSongs: boolean = false;
  type: any = '';
  abbumIdPlay: any;
  showSearch: boolean = false;
  mobileNumber: any;
  mostPlayedSongs: any;
  populatArtist: any;
  interval: any;
  duration: number = 0;

  playButton!: HTMLImageElement;
  nextButton!: HTMLImageElement;
  previousButton!: HTMLImageElement;

  lastScrollTop = 0;
  spotifyPlaylists: HTMLElement | null = null;

  playPauseSrc = 'assets/play.svg';
  playbuttonSrc = 'assets/play.svg';
  pauseButtonSrc = 'assets/pause.svg';
  playBt: any;
  closeVolume: any = 'assets/closevolume.svg';
  volumeIcon: string = 'assets/volume.svg';
  isMuted: boolean = false;
  youtubeId: string = '';

  albums: any[] = [];
  songs: any[] = [];
  player: any;

  // Track the currently playing song object
  currentSong: any;
  showSongList = false;
  haveMostPlayed = false;
  currentSongId = false;
  ytPlayer: any; 
  ytPlayerReady: boolean = false;

  ngOnInit() {
    this.mobileNumber = localStorage.getItem('mobileNumber') as string | null;
    this.type = localStorage.getItem('type') as string | null;
    this.getAll();
    this.getMostPlayedSongsByUser();
    this.getAllPopularArtist();

    const lastPlayedSong = JSON.parse(localStorage.getItem('lastPlayedSong') || 'null');
    if (lastPlayedSong) {
      this.playSongById(lastPlayedSong);
    }
  }

  masterSearch(searchKey: string) {
    if (searchKey && searchKey.trim()) {
      this.loginService.masterSearch(searchKey).subscribe(
        (response) => {
          if (response.code === 200) {
            this.searchResults = response.data;
            console.log("searchResults", this.searchResults)
          } else {
            this.searchResults = [];
          }
        },
        (error) => {
          console.error('Error fetching search results', error);
          this.searchResults = [];
        }
      );
    } else {
      this.searchResults = [];
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
      if (this.songs.length > 0 && this.songId != null) {
        this.playSongById(this.songs[0]);
      }
    })
  }

  loadVideo() {
    if (this.player) {
      this.player.loadVideoById(this.youtubeId);
      this.duration = this.player.getDuration();
    } else {
      this.loadPlayer(this.youtubeId);
    }
  }

  ngAfterViewInit() {
    if (!(window as any)['YT']) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  
    (window as any)['onYouTubeIframeAPIReady'] = () => {
      this.loadPlayer(this.youtubeId);
    };
  
    this.audioPlayer = this.audioPlayerRef.nativeElement;
  
    // Load last saved volume from localStorage if available
    const savedVolume = localStorage.getItem('lastVolume');
    if (savedVolume) {
      this.volumePercentage = parseInt(savedVolume, 10);
  
      // Apply to audio
      if (this.audioPlayer) {
        this.audioPlayer.volume = this.volumePercentage / 100;
      }
  
      // Apply to YouTube player if ready
      if (this.player && typeof this.player.setVolume === 'function') {
        this.player.setVolume(this.volumePercentage);
      }
  
      // Update UI icon
      if (this.volumePercentage === 0) {
        this.isMuted = true;
        this.volumeIcon = 'assets/mute.svg';
      } else {
        this.isMuted = false;
        this.volumeIcon = 'assets/volume.svg';
      }
    } else {
      // fallback: set default volume
      if (this.audioPlayer) {
        this.audioPlayer.volume = this.volumePercentage / 100;
      }
    }
  
    this.audioPlayer?.addEventListener('timeupdate', () => {
      this.updateSeekBar();
    });
  
    this.audioPlayer?.addEventListener('play', () => {
      this.playPauseSrc = this.pauseButtonSrc;
      this.isPlayPauseLoading = false;
      this.cdr.detectChanges();
    });
  
    this.audioPlayer?.addEventListener('pause', () => {
      this.playPauseSrc = this.playbuttonSrc;
      this.isPlayPauseLoading = false;
      this.cdr.detectChanges();
    });
  
    this.audioPlayer?.addEventListener('error', (event) => {
      this.isPlayPauseLoading = false;
      this.cdr.detectChanges();
      // this.openSnackBar('Error occurred while playing the audio.', 'close', 'error');
    });
  
    this.audioPlayer?.addEventListener('ended', () => {
      this.nextSong();
    });
  
    this.spotifyPlaylists = document.querySelector('.spotifyPlaylists');
  }
  

  toggleSearchBar() {
    this.showSearch = !this.showSearch;
  }

loadPlayer(videoId: any) {
  if (this.player && typeof this.player.loadVideoById === 'function') {
    this.player.loadVideoById(videoId);
    this.setHighQuality();
    this.duration = this.player.getDuration();
    this.updateYouTubeDuration();
    this.startTracking();
    return;
  }

  this.player = new YT.Player('player', {
    height: '0',   // Hide video
    width: '0',    // Hide video
    videoId: videoId,
    playerVars: {
      autoplay: 0,
      controls: 0,
      playsinline: 1,
      modestbranding: 1,
      iv_load_policy: 3,
      rel: 0,
    },
    events: {
      'onReady': () => {
        this.setHighQuality();
        this.duration = this.player.getDuration();
        this.updateYouTubeDuration();
        this.startTracking();
      },
      'onStateChange': (event: any) => {
        if (event.data === YT.PlayerState.PLAYING) {
          this.setHighQuality();
        }
      }
    }
  });
}

private setHighQuality() {
  if (this.player && typeof this.player.setPlaybackQuality === 'function') {
    this.player.setPlaybackQuality('highres');
    this.player.setPlaybackQuality('hd1080'); // fallback
  }
}



  // Update totalTime for YouTube video
updateYouTubeDuration() {
  if (this.player && typeof this.player.getDuration === 'function') {
    const duration = this.player.getDuration();
    if (isFinite(duration) && duration > 0) {
      this.duration = duration;
      this.totalTime = this.formatTime(duration);
    }
  }
}

  updateSeekBar() {
    // YouTube
    if (this.youtubeId && this.player?.getCurrentTime) {
      const ytCurrent = this.player.getCurrentTime();
      const ytDuration = this.player.getDuration();
      if (ytDuration > 0) {
        this.circlePosition = (ytCurrent / ytDuration) * 100;
        this.currentTime = this.formatTime(ytCurrent);
        this.totalTime = this.formatTime(ytDuration);
      }
      return;
    }
  
    // Audio
    if (this.audioPlayer?.duration) {
      const percentage = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
      this.circlePosition = percentage;
      this.currentTime = this.formatTime(this.audioPlayer.currentTime);
      this.totalTime = this.formatTime(this.audioPlayer.duration);
    }
  }
  

  // formatTime(time: number): string {
  //   if (typeof time !== 'number' || isNaN(time) || time < 0) return '0:00';
  //   const minutes = Math.floor(time / 60);
  //   const seconds = Math.floor(time % 60);
  //   return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  // }

  // Format seconds -> mm:ss
  formatTime(time: number): string {
    if (typeof time !== 'number' || isNaN(time) || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60); // floor to integer
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  


  // Seekbar click for audio
  adjustSong(event: MouseEvent) {
    if (this.youtubeId && this.player && typeof this.player.getDuration === 'function' && typeof this.player.seekTo === 'function') {
      // If YouTube is active, use YouTube seekbar logic
      this.adjustYouTubeSeekbar(event);
      return;
    }

    if (!this.audioPlayer) return;

    const duration = this.audioPlayer.duration;
    if (!isFinite(duration) || duration === 0) {
      console.warn('Audio not ready for seeking.');
      return;
    }

  const target = event.currentTarget as HTMLElement;
  const clickX = event.clientX - target.getBoundingClientRect().left;
  const percentage = clickX / target.clientWidth;
  const newTime = duration * percentage;

  this.audioPlayer.currentTime = newTime;
  this.circlePosition = percentage * 100;
  this.currentTime = this.formatTime(newTime);
}


seekTo(event: any) {
  if (this.player) {
    this.player.seekTo(this.currentTime, true);
  }
}
  
  
  
  
  

// adjustVolume(event: Event) {
//   const volumeLevel = (event.target as HTMLInputElement).value;
//   this.volumePercentage = parseInt(volumeLevel, 10);

//   // For audio element
//   if (this.audioPlayer) {
//     this.audioPlayer.volume = this.volumePercentage / 100;
//   }

//   // For YouTube player
//   if (this.player && typeof this.player.setVolume === 'function') {
//     this.player.setVolume(this.volumePercentage);
//   }

//   // Save for persistence
//   localStorage.setItem('lastVolume', volumeLevel);

//   // Update UI icons
//   if (this.volumePercentage === 0) {
//     this.isMuted = true;
//     this.volumeIcon = 'assets/mute.svg';
//   } else {
//     this.isMuted = false;
//     this.volumeIcon = 'assets/volume.svg';
//   }

//   this.cdr.detectChanges();
// }


  // togglePlay() {
  //   if (this.audioPlayer && this.audioPlayer.src) {
  //     if (this.audioPlayer.readyState >= 2) {
  //       if (this.audioPlayer.paused) {
  //         this.isPlayPauseLoading = true;
  //         this.cdr.detectChanges();
  //         const playPromise = this.audioPlayer.play();
  //         if (playPromise && typeof playPromise.then === 'function') {
  //           playPromise.finally(() => {
  //             this.isPlayPauseLoading = false;
  //             this.cdr.detectChanges();
  //           });
  //         }
  //       } else {
  //         this.isPlayPauseLoading = true;
  //         this.cdr.detectChanges();
  //         this.audioPlayer.pause();
  //       }
  //     } else {
  //       this.isPlayPauseLoading = true;
  //       this.cdr.detectChanges();
  //       this.openSnackBar('Please hold tight its going to rock.', 'close', 'error');
  //     }
  //   } else {
  //     this.isPlayPauseLoading = false;
  //     this.cdr.detectChanges();
  //     this.openSnackBar('Audio source is not set.', 'close', 'error');
  //   }
  // }

  adjustVolume(event: Event) {
    const volumeLevel = (event.target as HTMLInputElement).value;
    this.volumePercentage = parseInt(volumeLevel, 10);
  
    // For audio element
    if (this.audioPlayer) {
      this.audioPlayer.volume = this.volumePercentage / 100;
    }
  
    // For YouTube player
    if (this.player && typeof this.player.setVolume === 'function') {
      this.player.setVolume(this.volumePercentage);
    }
  
    // Save last volume for persistence
    localStorage.setItem('lastVolume', this.volumePercentage.toString());
  
    // Update UI icons
    if (this.volumePercentage === 0) {
      this.isMuted = true;
      this.volumeIcon = 'assets/mute.svg';
    } else {
      this.isMuted = false;
      this.volumeIcon = 'assets/volume.svg';
    }
  
    this.cdr.detectChanges();
  }
  

  togglePlay() {
    // If YouTube is active
    if (this.youtubeId && this.player) {
      const state = this.player.getPlayerState();
      // PLAYING
      if (state === YT.PlayerState.PLAYING) {
        this.player.pauseVideo();
        this.playPauseSrc = this.playbuttonSrc;
      } else {
        this.player.playVideo();
        this.playPauseSrc = this.pauseButtonSrc;
      }
      return;
    }
  
    // Otherwise, handle regular audio
    if (this.audioPlayer && this.audioPlayer.src) {
      if (this.audioPlayer.readyState >= 2) {
        if (this.audioPlayer.paused) {
          this.isPlayPauseLoading = true;
          this.cdr.detectChanges();
          const playPromise = this.audioPlayer.play();
          if (playPromise && typeof playPromise.then === 'function') {
            playPromise.finally(() => {
              this.isPlayPauseLoading = false;
              this.cdr.detectChanges();
              this.playPauseSrc = this.pauseButtonSrc;
            });
          }
        } else {
          this.isPlayPauseLoading = true;
          this.cdr.detectChanges();
          this.audioPlayer.pause();
          this.playPauseSrc = this.playbuttonSrc;
        }
      } else {
        this.isPlayPauseLoading = true;
        this.cdr.detectChanges();
        this.openSnackBar('Please hold tight, it\'s going to rock.', 'close', 'error');
      }
    } else {
      this.isPlayPauseLoading = false;
      this.cdr.detectChanges();
      this.openSnackBar('Audio source is not set.', 'close', 'error');
    }
  }
  
  

  stopOtherPlayer(type: 'audio' | 'youtube') {
    if (type === 'audio') {
      // Stop YouTube if playing
      if (this.player && typeof this.player.stopVideo === 'function') {
        this.player.stopVideo();
      }
      this.youtubeId = ''; // reset id so seekbar logic doesn’t think YT is active
    } else {
      // Stop audio if playing
      if (this.audioPlayer) {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
      }
      this.currentMusic = null;
    }
  }
  

  playSongById(song: any) {
    this.currentSong = song; // Set the currentSong object for template use
    this.currentMusicName = song.songTitle;
    this.currentArtistName = song.artistName;
    this.songDuration = song.duration;
    this.songId = song.songId;
    this.currentSongId = song.songId;

    if (song.youtubeId) {
      this.youtubeId = song.youtubeId;
      // this.currentMusic = `${SERVER_API_URL}/api/youtube-stream/${song.youtubeId}`;
      this.loadPlayer(this.youtubeId)
          const iframe = document.getElementById('yt-player') as HTMLIFrameElement;
    // if (iframe) {
    //   iframe.src = `https://www.youtube.com/embed/${song.youtubeId}?autoplay=1`;
    // }
    
    } else {
      this.currentMusic = song.songUrl;
    }

    localStorage.setItem('lastPlayedSong', JSON.stringify({
      songId: song.songId,
      songUrl: song.songUrl,
      youtubeId: song.youtubeId || null,
      songTitle: song.songTitle,
      artistName: song.artistName,
      duration: song.duration
    }));

    if (localStorage.getItem('mobileNumber')) {
      this.mobileNumber = localStorage.getItem('mobileNumber');
      this.loginService.increaseSongCount(this.songId, this.mobileNumber).subscribe();
    }

    // Remove previous canplaythrough event listeners to avoid stacking
    if (this.audioPlayer) {
      const clone = this.audioPlayer.cloneNode(true) as HTMLAudioElement;
      this.audioPlayer.parentNode?.replaceChild(clone, this.audioPlayer);
      this.audioPlayer = clone;
      // Restore volume after replacing node
      this.audioPlayer.volume = this.volumePercentage / 100;
      // Re-attach event listeners
      this.audioPlayer.addEventListener('timeupdate', () => this.updateSeekBar());
      this.audioPlayer.addEventListener('play', () => {
        this.playPauseSrc = this.pauseButtonSrc;
        this.isPlayPauseLoading = false;
        this.cdr.detectChanges();
      });
      this.audioPlayer.addEventListener('pause', () => {
        this.playPauseSrc = this.playbuttonSrc;
        this.isPlayPauseLoading = false;
        this.currentSongId = this.currentSongId 
        this.cdr.detectChanges();
      });
      this.audioPlayer.addEventListener('error', (event) => {
        this.isPlayPauseLoading = false;
        this.cdr.detectChanges();
        // this.openSnackBar('Error occurred while playing the audio.', 'close', 'error');
      });
      this.audioPlayer.addEventListener('ended', () => this.nextSong());
    }

    this.audioPlayer.src = this.currentMusic;
    this.audioPlayer.load();

    // Restore volume after loading new song
    if (this.audioPlayer) {
      this.audioPlayer.volume = this.volumePercentage / 100;
    }

    this.isPlayPauseLoading = true;
    this.cdr.detectChanges();

    const canplaythroughHandler = () => {
      this.audioPlayer.play();
      this.playPauseSrc = this.pauseButtonSrc;
      this.isPlayPauseLoading = false;
      this.cdr.detectChanges();
      this.audioPlayer.removeEventListener('canplaythrough', canplaythroughHandler);
    };
    this.audioPlayer.addEventListener('canplaythrough', canplaythroughHandler);
  }

// Start interval tracking for YouTube seekbar
// Start interval tracking for YouTube or audio seekbar
startTracking() {
  if (this.interval) clearInterval(this.interval);

  // Immediately sync play/pause icon
  if (this.youtubeId && this.player) {
    const state = this.player.getPlayerState();
    this.playPauseSrc = state === YT.PlayerState.PLAYING ? this.pauseButtonSrc : this.playbuttonSrc;
  } else if (this.audioPlayer) {
    this.playPauseSrc = this.audioPlayer.paused ? this.playbuttonSrc : this.pauseButtonSrc;
  }

  this.interval = setInterval(() => {
    if (this.youtubeId && this.player && typeof this.player.getCurrentTime === 'function' && typeof this.player.getDuration === 'function') {
      const current = this.player.getCurrentTime();
      const duration = this.player.getDuration();
      if (isFinite(current) && isFinite(duration) && duration > 0) {
        this.circlePosition = (current / duration) * 100;
        this.currentTime = this.formatTime(current);
        this.totalTime = this.formatTime(duration);
      }

      // Sync YouTube play/pause icon continuously
      const state = this.player.getPlayerState();
      this.playPauseSrc = state === YT.PlayerState.PLAYING ? this.pauseButtonSrc : this.playbuttonSrc;

    } else if (this.audioPlayer) {
      const current = this.audioPlayer.currentTime;
      const duration = this.audioPlayer.duration;
      if (isFinite(current) && isFinite(duration)) {
        this.circlePosition = (current / duration) * 100;
        this.currentTime = this.formatTime(current);
        this.totalTime = this.formatTime(duration);
      }

      // Sync audio play/pause icon continuously
      this.playPauseSrc = this.audioPlayer.paused ? this.playbuttonSrc : this.pauseButtonSrc;
    }

    // Trigger Angular change detection
    this.cdr.detectChanges();
  }, 500);
}


  toggleVolume() {
    if (this.isMuted) {
      // Restore last volume
      const lastVolume = localStorage.getItem('lastVolume');
      let volumeToSet = 100;
      if (lastVolume !== null) {
        const parsed = parseInt(lastVolume, 10);
        if (!isNaN(parsed)) {
          volumeToSet = parsed;
        }
      }
      this.volumePercentage = volumeToSet;
  
      if (this.audioPlayer) this.audioPlayer.volume = volumeToSet / 100;
      if (this.player && typeof this.player.setVolume === 'function') {
        this.player.setVolume(volumeToSet);
      }
  
      this.volumeIcon = 'assets/volume.svg';
      this.isMuted = false;
    } else {
      // Save current before muting
      localStorage.setItem('lastVolume', this.volumePercentage.toString());
  
      this.volumePercentage = 0;
      if (this.audioPlayer) this.audioPlayer.volume = 0;
      if (this.player && typeof this.player.setVolume === 'function') {
        this.player.setVolume(0);
      }
  
      this.volumeIcon = 'assets/mute.svg';
      this.isMuted = true;
    }
  
    this.cdr.detectChanges();
  }
  

  nextSong() {
    if (this.songs.length === 0) return;
    const currentIndex = this.songs.findIndex(song => (song.songUrl === this.currentMusic || song.youtubeId === this.youtubeId));
    let nextIndex = currentIndex + 1;
    if (nextIndex >= this.songs.length) {
      nextIndex = 0;
    }
    const nextSong = this.songs[nextIndex];
    this.playSongById(nextSong);
  }

  previousSong() {
    if (this.songs.length === 0) return;
    const currentIndex = this.songs.findIndex(song => (song.songUrl === this.currentMusic || song.youtubeId === this.youtubeId));
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = this.songs.length - 1;
    }
    const prevSong = this.songs[prevIndex];
    this.playSongById(prevSong);
  }

  loginForm() {
    this.router.navigate(['/login']);
  }

  signOutForm() {
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
  }

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
    song.liked = !song.liked;
    if (song.liked) {
      this.addToLikedSongs(song.songId, song.liked);
    } else {
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

  getAllPopularArtist(): void {
    this.loginService.getAllPopularArtist().subscribe(
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
    this.loginService.songsByArtistId(artistId).subscribe((res: any) => {
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

  navigateToEaseOnTech() {
    this.router.navigate(['/easeontech']);
  }

isYouTubePlaying(): boolean {
  // Check if the YouTube player exists and is currently playing
  if (this.player && typeof this.player.getPlayerState === 'function') {
    // 1 = playing, 2 = paused, 3 = buffering, 5 = video cued
    return this.player.getPlayerState() === 1;
  }
  return false;
}

adjustYouTubeSeekbar(event: MouseEvent) {
  if (!this.player || typeof this.player.seekTo !== 'function') return;

  const seekbar = event.currentTarget as HTMLElement;
  const rect = seekbar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const percent = clickX / rect.width;

  const duration = this.player.getDuration();
  const seekToTime = percent * duration;

  this.player.seekTo(seekToTime, true);
  this.circlePosition = percent * 100;
  this.currentTime = this.formatTime(seekToTime);

  // ensure YouTube keeps playing after seek
  if (this.player.getPlayerState() !== 1) {
    this.player.playVideo();
  }
}



};

