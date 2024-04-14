import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from 'src/app/services/login.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-song-edit',
  templateUrl: './song-edit.component.html',
  styleUrl: './song-edit.component.scss'
})
export class SongEditComponent {

  selectedAlbum!: any;
  albums: any[] = [];
  selectedArtist: any;
  artists: any[] = [];
  songTitle: string = '';
  duration: string = '';
  songUrl: string = '';
  releaseDate: string = '';
  genre: string = '';
  artistDataString: string = '';
  albumDataString: string = '';
  songId!: number;
  artistName: any = '';
  albumName: any = '';
  song: any = {};



  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.songId = params['id'];
      this.getSongById(this.songId);
    });

    this.getAllArtists();
    this.getAllAlbum();



  }

  getAllArtists(): void {
    this.loginService.getAllArtist().subscribe(
      (res: any) => {
        this.artists = res.data;
        this.cdr.detectChanges();
        // this.patchFormValues();
      },
      (error) => {
        console.error('Error fetching artists:', error);
      }
    );
  }

  getAllAlbum(): void {
    this.loginService.getAllAlbum().subscribe(
      (res: any) => {
        this.albums = res.data;
        // this.getSongById(songdId)
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching artists:', error);
      }
    );
  };

  getSongById(songId: number) {
    console.log(songId, "songid===========")
    this.loginService.getSongById(songId).subscribe((res: any) => {
      this.song = res.data;
      this.songTitle = this.song.songTitle;
      this.duration = this.song.duration
      this.songUrl = this.song.songUrl
      this.releaseDate = this.song.releaseDate
      this.genre = this.song.genre
      this.artistName = this.song.artistName
    })

  }

  submit() {
    const songDataToUpdate: any = {
      selectedAlbum: this.selectedAlbum,
      selectedArtist: this.selectedArtist,
      songTitle: this.songTitle,
      duration: this.duration,
      songUrl: this.songUrl,
      releaseDate: this.releaseDate,
      genre: this.genre
    }
    this.loginService.updateSongById(this.songId, songDataToUpdate).subscribe((res: any) => {
      if (!res) {
        this.openSnackBar(res.message, "close", "error");
      }
      this.openSnackBar(res.message, "close", "success")
    })
  };

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
