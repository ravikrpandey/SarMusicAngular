import { ChangeDetectorRef, Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';

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
    private cdr: ChangeDetectorRef 
  ) {

  }

  ngOnInit() {
    this.getAllArtists();
    if (this.selectedArtist) {
      console.log('Selected artist:', this.selectedArtist);
    };
    this.getAllAlbum();
    if (this.selectedAlbum) {
      console.log('Selected artist:', this.selectedAlbum);
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
      if (res.data) {
        this.toastr.success('Song Created Successfully'); // Display success toaster message
      }
    });
  }

};
