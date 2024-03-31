import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistCreateComponent } from './artist-create/artist-create.component';
import { ArtistRoutingModule } from './artist-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ArtistCreateComponent],
  imports: [
    CommonModule,
    ArtistRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ArtistModuleModule { }
