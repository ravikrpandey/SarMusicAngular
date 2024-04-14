import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { Location } from '@angular/common';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


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
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private location: Location,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getAll();
  }

  getAll() {
    this.loginService.getAllArtist().subscribe((res: any) => {
      this.artists = res.data;
      this.cdr.detectChanges();
    }, (error) => {
      console.error('Error fetching artists:', error);
    });
  }

  editArtist(artistId: string) {
    this.router.navigate(['admin/artist/edit', artistId]);
  }

  openSnackBar(message: string, action: string, type: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: type == 'error' ? ['snackbar-error'] : ['snackbar-success'],
      verticalPosition: 'top',
      horizontalPosition:'right',
    });
  }


  deleteArtist(artistId: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        message: 'Are you sure you want to delete this artist?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loginService.deleteArtist(artistId).subscribe((res: any) => {
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
