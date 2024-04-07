import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumCreateComponent } from './album-create/album-create.component';
import { AlbumListComponent } from './album-list/album-list.component';

const routes: Routes = [
  {path: '', component: AlbumListComponent},
  {path: 'create', component: AlbumCreateComponent},
  {path: 'list', component: AlbumListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumRoutingModule { }
