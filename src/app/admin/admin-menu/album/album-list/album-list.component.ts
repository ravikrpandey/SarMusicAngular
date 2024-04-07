import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-album-list',
  templateUrl: './album-list.component.html',
  styleUrl: './album-list.component.scss'
})
export class AlbumListComponent {

  albums: any[] = [];
  album: any;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef 
  ) { 
  }


  ngOnInit() {
      this.getAll();
  }
  getAll() {
    this.loginService.getAllAlbum().subscribe((res: any) => {
      this.albums = res.data;
      console.log(res.data, "albumData==========")
      this.cdr.detectChanges();

    })
  }

editalbum(arg0: any) {
throw new Error('Method not implemented.');
}
deletealbum(arg0: any) {
throw new Error('Method not implemented.');
}


}
