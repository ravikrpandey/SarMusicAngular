import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-album-create',
  templateUrl: './album-create.component.html',
  styleUrls: ['./album-create.component.scss'] // Corrected property name to styleUrls
})
export class AlbumCreateComponent implements OnInit { // Implement OnInit interface

  artists: any[] = [];
  artistDataString: string = '';
  albumName: string = '';
  releaseDate: string = '';
  genre: string = '';
  albumCardUrl: string = '';
  artistId: string = '';
  selectedArtist: any;

  constructor(
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getAllArtists();
    if (this.selectedArtist) {
      console.log('Selected artist:', this.selectedArtist);
    }
  }

  submit() {
    const albumData: any = {
      albumName: this.albumName,
      releaseDate: this.releaseDate,
      genre: this.genre,
      albumCardUrl: this.albumCardUrl,
      artistId: this.selectedArtist.artistId,
      artistName: this.selectedArtist.artistName
    }
    this.loginService.createAlbum(albumData).subscribe((res: any) => {
      if (res) {
        this.openSnackBar(res.message, 'close', 'Success');
      } else {
        this.openSnackBar(res.message, 'close', 'error');
      }

    })
  }

  getAllArtists(): void {
    this.loginService.getAllArtist().subscribe(
      (res: any) => {
        this.artists = res.data;
        // Call a method to format the artist data
        this.formatArtistData();
      },
      (error) => {
        console.error('Error fetching artists:', error);
      }
    );
  }

  formatArtistData(): void {
    // Iterate over the artists array and format the data into a string
    this.artistDataString = this.artists.map(artist => `${artist.artistName} - ${artist.gender}`).join('\n');
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
}
