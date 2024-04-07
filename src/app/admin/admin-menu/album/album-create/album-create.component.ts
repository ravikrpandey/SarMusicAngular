import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

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
    private loginService: LoginService
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
      if (res.data.code === 200) {
        alert(res.message)
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
}
