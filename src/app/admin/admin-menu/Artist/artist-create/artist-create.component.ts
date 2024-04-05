import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { log } from 'console';

import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-artist-create',
  templateUrl: './artist-create.component.html',
  styleUrls: ['./artist-create.component.scss']
})
export class ArtistCreateComponent {
  artistName: string = '';
  dob: string = '';
  gender: string = '';
  artistProfileUrl: string = '';
  bio: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService
  ) {}

ngOnInit(){}

submit() {
  const artistData: any = {
    artistName: this.artistName,
    dob: this.dob,
    gender: this.gender,
    artistProfileUrl: this.artistProfileUrl,
    bio: this.bio
  }
  console.log(artistData, "artistData-----")
  this.loginService.createArtist(artistData).subscribe((res: any) => {
    if(res.status === 403 || res.status == 500) {
      this.toastr.error(res.body.message, 'Error');
      alert("Error");
    } else {
      this.toastr.success('Artist Created successfully!', 'Success');
      alert("Artist Created successfully!");
    }
  })

}




  }


