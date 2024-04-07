import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.scss']
})
export class ArtistListComponent implements OnInit {

  artists: any[] = [];
  artist: any;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.loginService.getAllArtist().subscribe((res: any) => { 
      console.log(res.data, "res-----");
      this.artists = res.data; 
      this.cdr.detectChanges(); // Trigger change detection
    }, (error) => {
      console.error('Error fetching artists:', error);
    });
  }

  editArtist(artistId: string) {
    this.router.navigate(['admin/artist/edit', artistId]);
  }
  

  deleteArtist(artist: any) {
    // Implement delete logic here
    // this.loginService.deleteArtist(artist.id).subscribe(() => {
    //   // Remove artist from the array
    //   this.artists = this.artists.filter(a => a.id !== artist.id);
    //   this.toastr.success('Artist deleted successfully.');
    // }, (error) => {
    //   console.error('Error deleting artist:', error);
    //   this.toastr.error('Failed to delete artist.');
    // });
  }
}
