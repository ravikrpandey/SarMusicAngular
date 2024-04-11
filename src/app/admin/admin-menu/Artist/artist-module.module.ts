import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistCreateComponent } from './artist-create/artist-create.component';
import { ArtistRoutingModule } from './artist-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArtistListComponent } from './artist-list/artist-list.component';
import { ArtistEditComponent } from './artist-edit/artist-edit.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [ArtistCreateComponent, ArtistListComponent, ArtistEditComponent],
  imports: [
    CommonModule,
    ArtistRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
  ]
})
export class ArtistModuleModule { }
