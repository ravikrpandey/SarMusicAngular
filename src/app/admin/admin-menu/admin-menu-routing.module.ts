import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './admin-main.component';
import { DashboardListComponent } from './dashboard/dashboard-list/dashboard-list.component';

const routes: Routes = [
  {
    path: '',
    component: AdminMainComponent,
    children: [
      {
        path: '',
        component: DashboardListComponent
      },
      { path: 'artist', loadChildren: () => import('../admin-menu/Artist/artist-module.module').then(m => m.ArtistModuleModule) },
      { path: 'list-dashboard', loadChildren: () => import('../admin-menu/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'album', loadChildren: () => import('../admin-menu/album/album.module').then(m => m.AlbumModule) },
      { path: 'song', loadChildren: () => import('../admin-menu/songs/songs.module').then(m => m.SongsModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminMenuRoutingModule { }
