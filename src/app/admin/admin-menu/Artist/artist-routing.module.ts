import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ArtistCreateComponent } from '../Artist/artist-create/artist-create.component';

const routes: Routes = [
  { path: '', component: ArtistCreateComponent },
  // { path: 'artist-create', component: ArtistCreateComponent },
  // { path: 'genre-list', component:  GenreListComponent},
  // { path: 'genre-edit', component:  GenreEditComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistRoutingModule { }
