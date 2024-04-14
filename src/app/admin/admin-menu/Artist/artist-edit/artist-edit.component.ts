import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-artist-edit',
  templateUrl: './artist-edit.component.html',
  styleUrls: ['./artist-edit.component.scss']
})
export class ArtistEditComponent implements OnInit {
  artistId!: string;
  artist: any = {};
  artistName: string = '';
  dob: string = '';
  gender: string = '';
  artistProfileUrl: string = '';
  bio: string = '';

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.artistId = params['id'];
      this.getArtistDetails(this.artistId);
    });
  }

  getArtistDetails(artistId: string): void {
    this.loginService.getArtistById(artistId).subscribe((res: any) => {
      this.artist = res.data;
      this.patchFormValues();
    }, error => {
      console.error('Error fetching artist details:', error);
      this.openSnackBar('Failed to fetch artist details', "close", "error");
    });
  }

  patchFormValues(): void {
    this.artistName = this.artist.artistName;
    this.dob = this.artist.dob;
    this.gender = this.artist.gender;
    this.artistProfileUrl = this.artist.artistProfileUrl;
    this.bio = this.artist.bio;
    this.cdr.detectChanges();
  }

  submit(): void {
    const artistDataForUpdate: any = {
      artistName: this.artistName,
      dob: this.dob,
      gender: this.gender,
      artistProfileUrl: this.artistProfileUrl,
      bio: this.bio
    }
    this.loginService.updateArtisById(artistDataForUpdate, this.artistId).subscribe((res: any) => {
      if (!res) {
        this.openSnackBar(res.message, "close", "error");
        this.getArtistDetails(this.artistId);
      } else {
        this.openSnackBar(res.message, "close", "success");
      }
    })
  };

  cancel() {
    this.location.back();
  }

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: type == 'error' ? ['snackbar-error'] : ['snackbar-success'],
      verticalPosition: 'top',
      horizontalPosition:'right',

    });
  }
}
