import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrl: './artist-list.component.scss'
})
export class ArtistListComponent {
  artists: any[] = [];

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.loginService.getAllArtist().subscribe((res: any) => { 
      console.log(res.data, "res-----");
      this.artists = res.data; 
    }, (error) => {
      console.error('Error fetching artists:', error);
    });
  }

}
