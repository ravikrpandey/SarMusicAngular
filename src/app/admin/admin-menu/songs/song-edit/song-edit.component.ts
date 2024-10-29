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
  sourceType: 'url' | 'file' = 'url'; // Track the selected source type (URL or File)
  songId!: number;
  songFile: string | null = null; // To store base64-encoded file content if file is chosen
  song: any = {};

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private snackBar: MatSnackBar
  ) {}

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
      },
      error => {
        console.error('Error fetching artists:', error);
      }
    );
  }

  getAllAlbum(): void {
    this.loginService.getAllAlbum().subscribe(
      (res: any) => {
        this.albums = res.data;
        this.cdr.detectChanges();
      },
      error => {
        console.error('Error fetching albums:', error);
      }
    );
  }

  getSongById(songId: number) {
    this.loginService.getSongById(songId).subscribe((res: any) => {
      this.song = res.data;
      this.songTitle = this.song.songTitle;
      this.duration = this.song.duration;
      this.songUrl = this.song.songUrl;
      this.releaseDate = this.song.releaseDate;
      this.genre = this.song.genre;
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.convertFileToBase64(file).then((base64String: string) => {
        this.songFile = base64String; // Store base64 string of the file
      });
    }
  }

  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  submit() {
    debugger;
    const songDataToUpdate: any = {
      selectedAlbum: this.selectedAlbum,
      selectedArtist: this.selectedArtist,
      songTitle: this.songTitle,
      duration: this.duration,
      releaseDate: this.releaseDate,
      genre: this.genre,
      sourceType: this.sourceType,
      // Conditionally add either the URL or file based on source type
      ...(this.sourceType === 'url' ? { songUrl: this.songUrl } : { songFile: this.songFile })
    };

    this.loginService.updateSongById(this.songId, songDataToUpdate).subscribe((res: any) => {
      if (!res) {
        this.openSnackBar(res.message, "close", "error");
      }
      this.openSnackBar(res.message, "close", "success");
    });
  }

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: type === 'error' ? ['snackbar-error'] : ['snackbar-success'],
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  cancel() {
    this.location.back();
  }
}
