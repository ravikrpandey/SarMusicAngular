import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent {

  songs: any[] = [];
  audioPlayers: Map<number, HTMLAudioElement> = new Map<number, HTMLAudioElement>();

  

  constructor(
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getAll();
  }

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  getAll() {
    this.loginService.getAllSongs().subscribe((res: any) => {
      this.songs = res.data;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.songs.forEach(song => {
      const audioPlayer = document.getElementById(`audioPlayer_${song.songId}`) as HTMLAudioElement;
      this.audioPlayers.set(song.songId, audioPlayer);
    });
  }

  togglePlay(songId: number) {
    const audioPlayer = this.audioPlayers.get(songId);
    if (audioPlayer) {
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    }
  }

  playSong(song: any) {
    const audioPlayer = this.audioPlayers.get(song.songId);
    console.log("loged play button", audioPlayer)
    if (audioPlayer) {
        
        console.log(audioPlayer, "---------")
        audioPlayer.play();

        this.togglePlay(song.songId)

    }
  }

  editSong(songId: any) {
    this.router.navigate(['admin/song/edit', songId])
  }

  deleteSong(songId: any) {
    this.loginService.deleteSong(songId).subscribe((res: any) => {
      if (res) {
        this.openSnackBar(res.message, 'close', 'Success');
        window.location.reload();
      } else {
        this.openSnackBar(res.message, 'close', 'error');
      }
    })
  }
}
