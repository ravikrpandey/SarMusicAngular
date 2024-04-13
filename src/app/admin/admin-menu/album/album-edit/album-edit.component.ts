import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-album-edit',
  templateUrl: './album-edit.component.html',
  styleUrl: './album-edit.component.scss'
})
export class AlbumEditComponent {
  albumId!: number;
  album: any;
  albumForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private loginService: LoginService,
    private fb: FormBuilder,
    private location: Location
  ) {

    this.albumForm = this.fb.group({
      albumName: new FormControl(null),
      releaseDate: new FormControl(null),
      genre: new FormControl(null),
      albumCardUrl: new FormControl(null),
      artistName: new FormControl(null)
    })

  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.albumId = params['id'];
      this.getAlbumById(this.albumId);
    });

  }

  getAlbumById(albumId: any) {
    this.loginService.getAlbumById(albumId).subscribe((res: any) => {
      this.album = res.data;
      this.albumForm.patchValue({
        albumName: this.album?.albumName,
        releaseDate: this.album?.releaseDate,
        genre: this.album?.genre,
        albumCardUrl: this.album?.albumCardUrl,
        artistName: this.album?.artistName
      })
      console.log('res of album by id', res)

    })

  }

  submit() {
    
  }

  cancel() {
    this.location.back();
  }

}
