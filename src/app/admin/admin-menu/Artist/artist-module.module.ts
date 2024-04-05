import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistCreateComponent } from './artist-create/artist-create.component';
import { ArtistRoutingModule } from './artist-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArtistListComponent } from '../artist-list/artist-list.component';



@NgModule({
  declarations: [ArtistCreateComponent, ArtistListComponent],
  imports: [
    CommonModule,
    ArtistRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ArtistModuleModule { }
