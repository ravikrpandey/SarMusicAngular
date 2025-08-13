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
    private renderer: Renderer2
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

  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
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
  type: any = '';
  abbumIdPlay: any;
  showSearch: boolean = false;
  mobileNumber: any;
  mostPlayedSongs: any;
  populatArtist: any;

  audioPlayer!: HTMLAudioElement;
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

  // Track the currently playing song object
  currentSong: any;
  showSongList = false;
  haveMostPlayed = false;
  currentSongId = false;

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
      if (this.songs.length > 0 && this.songId == null) {
        this.playSongById(this.songs[0]);
      }
    })
  }

  ngAfterViewInit() {
    this.audioPlayer = this.audioPlayerRef?.nativeElement;

    // Set initial volume from localStorage if available
    if (this.audioPlayer) {
      this.audioPlayer.volume = this.volumePercentage / 100;
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
    if (this.audioPlayer) {
      const normalizedVolume = parseFloat(volumeLevel) / 100;
      this.audioPlayer.volume = normalizedVolume;
      localStorage.setItem('lastVolume', volumeLevel);
      this.volumePercentage = parseInt(volumeLevel, 10);
      if (this.audioPlayer.volume === 0) {
        this.isMuted = true;
        this.volumeIcon = 'assets/mute.svg';
      } else {
        this.isMuted = false;
        this.volumeIcon = 'assets/volume.svg';
      }
      this.cdr.detectChanges();
    }
  }

  togglePlay() {
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
            });
          }
        } else {
          this.isPlayPauseLoading = true;
          this.cdr.detectChanges();
          this.audioPlayer.pause();
        }
      } else {
        this.isPlayPauseLoading = true;
        this.cdr.detectChanges();
        this.openSnackBar('Please hold tight its going to rock.', 'close', 'error');
      }
    } else {
      this.isPlayPauseLoading = false;
      this.cdr.detectChanges();
      this.openSnackBar('Audio source is not set.', 'close', 'error');
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
      this.currentMusic = `${SERVER_API_URL}/api/youtube-stream/${song.youtubeId}`;
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
        this.openSnackBar('Error occurred while playing the audio.', 'close', 'error');
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

  toggleVolume() {
    if (this.audioPlayer) {
      if (this.isMuted) {
        const lastVolume = localStorage.getItem('lastVolume');
        let volumeToSet = 1;
        if (lastVolume !== null) {
          const parsed = parseInt(lastVolume, 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
            volumeToSet = parsed / 100;
            this.volumePercentage = parsed;
          }
        }
        this.audioPlayer.volume = volumeToSet;
        this.volumeIcon = 'assets/volume.svg';
        this.isMuted = false;
      } else {
        localStorage.setItem('lastVolume', Math.round(this.audioPlayer.volume * 100).toString());
        this.audioPlayer.volume = 0;
        this.volumeIcon = 'assets/mute.svg';
        this.volumePercentage = 0;
        this.isMuted = true;
      }
      this.cdr.detectChanges();
    }
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
};

