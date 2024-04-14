import { ChangeDetectorRef, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-song-create',
  templateUrl: './song-create.component.html',
  styleUrl: './song-create.component.scss'
})
export class SongCreateComponent {

  albums: any[] = [];
  selectedAlbum: any;
  artists: any[] = [];
  selectedArtist: any;
  songTitle: string = '';
  duration: string = '';
  songUrl: string = '';
  releaseDate: string = '';
  genre: string = '';
  artistDataString: string = '';
  albumDataString: string = '';


  constructor(
    private toastr: ToastrService,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef ,
    private location: Location,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit() {
    this.getAllArtists();
    if (this.selectedArtist) {
    };
    this.getAllAlbum();
    if (this.selectedAlbum) {
    };
  }

  getAllArtists(): void {
    this.loginService.getAllArtist().subscribe(
      (res: any) => {
        this.formatArtistData();
        this.artists = res.data;
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
        this.formatAlbumData();
        this.albums = res.data;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching artists:', error);
      }
    );
  }

  formatAlbumData(): void {
    this.albumDataString = this.albums.map(album => `${album.albunName} - ${album.gender}`).join('\n');
  }



  submit() {
    const songData: any = {
      albumId: this.selectedAlbum.albumId,
      albumName: this.selectedAlbum.albumName,
      albumCardUrl: this.selectedAlbum.albumCardUrl,
      artistId: this.selectedArtist.artistId,
      artistName: this.selectedArtist.artistName,
      songTitle: this.songTitle,
      duration: this.duration,
      songUrl: this.songUrl,
      releaseDate: this.releaseDate,
      genre: this.genre
    };

    this.loginService.createSong(songData).subscribe((res: any) => {
      if (res) {
        this.openSnackBar(res.message, 'close', 'Success');
      } else {
        this.openSnackBar(res.message, 'close', 'error');
      }
    });
  }

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: type == 'error' ? ['snackbar-error'] : ['snackbar-success'],
      verticalPosition: 'top',
      horizontalPosition:'right',

    });
  }

  cancel() {
    this.location.back();
  }

};
