import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Location } from '@angular/common';


@Component({
  selector: 'app-artist-create',
  templateUrl: './artist-create.component.html',
  styleUrls: ['./artist-create.component.scss'],
})
export class ArtistCreateComponent {
  artistName: string = '';
  dob: string = '';
  gender: string = '';
  artistProfileUrl: any
  bio: string = '';
  artistForm!: NgForm;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {}

  ngOnInit() {}

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: type == 'error' ? ['snackbar-error'] : ['snackbar-success'],
      verticalPosition: 'top',
      horizontalPosition:'right',

    });
  }

  submit(artistForm: any) {
    // const artistData: any = {
    //   artistName: this.artistName,
    //   dob: this.dob,
    //   gender: this.gender,
    //   artistProfileUrl: this.artistProfileUrl,
    //   bio: this.bio
    // }
    console.log(artistForm.value, "artistData-----")
    this.loginService.createArtist(artistForm.value).subscribe(
      (res: any) => {
        if (res.message) {
          this.openSnackBar(res.message, 'close', res.status);
        } else {
            this.openSnackBar('error', 'close', 'Error In Creating Artist');
          }
      },

    );


  }

  cancel() {
    this.location.back();
  }


}
