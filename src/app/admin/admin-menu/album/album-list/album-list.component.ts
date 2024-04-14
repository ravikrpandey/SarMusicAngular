import { ChangeDetectorRef, Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

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
    private cdr: ChangeDetectorRef ,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    
  ) { 
  }

  ngOnInit() {
    this.getAll();
  };
  
  getAll() {
    this.loginService.getAllAlbum().subscribe((res: any) => {
      this.albums = res.data;
      this.cdr.detectChanges();

    })
  };

editalbum(albumId: any) {
this.router.navigate(['admin/album/edit', albumId])
};


openSnackBar(message: string, action: string, type: string) {
  this.snackBar.open(message, action, {
    duration: 5000,
    panelClass: type == 'error' ? ['snackbar-error'] : ['snackbar-success'],
    verticalPosition: 'top',
    horizontalPosition:'right',
  });
}

deletealbum(albumId: any) {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: {
      message: 'Are you sure you want to delete this album?'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.loginService.deleteAlbumById(albumId).subscribe((res: any) => {
        if (res && res.message) {
          this.openSnackBar(res.message, "close", "success");
          this.getAll();
        } else {
          this.openSnackBar("Failed to delete album", "close", "error");
        }
      });
    }
  });

}
};
