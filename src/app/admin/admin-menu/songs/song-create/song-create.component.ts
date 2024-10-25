import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-song-create',
  templateUrl: './song-create.component.html',
  styleUrls: ['./song-create.component.scss']
})
export class SongCreateComponent implements OnInit {

  albums: any[] = [];
  selectedAlbum: any;
  artists: any[] = [];
  selectedArtist: any;
  songs: any[] = [
    { title: '', duration: '', releaseDate: '', genre: '', sourceType: 'url', url: '', file: null }
  ];
  artistDataString: string = '';
  albumDataString: string = '';

  constructor(
    private toastr: ToastrService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getAllArtists();
    this.getAllAlbum();
  }

  getAllArtists(): void {
    this.loginService.getAllArtist().subscribe(
      (res: any) => {
        this.artists = res.data;
        this.formatArtistData();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching artists:', error);
      }
    );
  }

  formatArtistData(): void {
    this.artistDataString = this.artists.map(artist => `${artist.artistName} - ${artist.gender}`).join('\n');
  }
  
  getAllAlbum(): void {
    this.loginService.getAllAlbum().subscribe(
      (res: any) => {
        this.albums = res.data;
        this.formatAlbumData();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching albums:', error);
      }
    );
  }

  formatAlbumData(): void {
    this.albumDataString = this.albums.map(album => `${album.albumName} - ${album.genre}`).join('\n');
  }

  addSong() {
    debugger
    this.songs.push({ title: '', duration: '', releaseDate: '', genre: '', sourceType: 'url', url: '', file: null });
  }

  removeSong(index: number) {
    this.songs.splice(index, 1);
  }

  onFileChange(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.songs[index].file = file;
    }
  }

  submit() {
    const songDataArray = this.songs.map(song => ({
      albumId: this.selectedAlbum.albumId,
      albumName: this.selectedAlbum.albumName,
      albumCardUrl: this.selectedAlbum.albumCardUrl,
      artistId: this.selectedArtist.artistId,
      artistName: this.selectedArtist.artistName,
      songTitle: song.title,
      duration: song.duration,
      songUrl: song.sourceType === 'url' ? song.url : '',
      songFile: song.sourceType === 'file' ? song.file : null,
      releaseDate: song.releaseDate,
      genre: song.genre
    }));

    songDataArray.forEach(songData => {
      this.loginService.createSong(songData).subscribe((res: any) => {
        if (res) {
          this.openSnackBar(res.message, 'close', 'Success');
        } else {
          this.openSnackBar(res.message, 'close', 'error');
        }
      });
    });
  }

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success'],
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  cancel() {
    this.location.back();
  }
}
