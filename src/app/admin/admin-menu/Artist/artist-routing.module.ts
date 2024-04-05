import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ArtistCreateComponent } from '../Artist/artist-create/artist-create.component';
import { ArtistListComponent } from '../artist-list/artist-list.component';

const routes: Routes = [
  { path: '', component: ArtistCreateComponent },
  { path: 'create', component: ArtistCreateComponent },
  { path: 'get-list', component:  ArtistListComponent},
  // { path: 'genre-edit', component:  GenreEditComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistRoutingModule { }
