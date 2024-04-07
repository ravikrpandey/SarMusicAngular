import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ArtistCreateComponent } from '../Artist/artist-create/artist-create.component';
import { ArtistListComponent } from './artist-list/artist-list.component';
import { ArtistEditComponent } from './artist-edit/artist-edit.component';

const routes: Routes = [
  { path: '', component: ArtistListComponent },
  { path: 'list', component:  ArtistListComponent},
  { path: 'create', component: ArtistCreateComponent },
  { path: 'edit/:id', component:  ArtistEditComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistRoutingModule { }
