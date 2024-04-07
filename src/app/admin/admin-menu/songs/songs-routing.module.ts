import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongCreateComponent } from './song-create/song-create.component';
import { SongListComponent } from './song-list/song-list.component';
import { SongEditComponent } from './song-edit/song-edit.component';

const routes: Routes = [
  {path: '', component: SongCreateComponent},
  {path: 'create', component: SongCreateComponent},
  {path: 'list', component: SongListComponent},
  {path: 'edit/:id', component: SongEditComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongsRoutingModule { }
