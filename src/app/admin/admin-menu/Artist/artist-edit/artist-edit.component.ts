import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';

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
    private cdr: ChangeDetectorRef
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
      this.cdr.detectChanges(); 
      console.log(res.data, "res.data-------")
      this.artistName = this.artist.artistName;
      this.dob = this.artist.dob;
      this.gender = this.artist.gender;
      this.artistProfileUrl = this.artist.artistProfileUrl;
      this.bio = this.artist.bio;
    }, error => {
      console.error('Error fetching artist details:', error);
      this.toastr.error('Failed to fetch artist details');
    });
  }

  submit(): void {
    // Implement your update logic here
    console.log('Update artist:', this.artist);
    // Call service method to update artist details
    // Display success/failure message using ToastrService
  }
}
