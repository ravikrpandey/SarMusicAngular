import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './admin-main.component';

const routes: Routes = [
  {path:'',component:AdminMainComponent,
children:[
  { path: 'artist', loadChildren: () => import('../admin-menu/Artist/artist-module.module').then(m => m.ArtistModuleModule) },

  { path: 'new-dashboard', loadChildren: () => import('../admin-menu/dashboard/dashboard.module').then(m => m.DashboardModule) },
  
]
},
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminMenuRoutingModule { }
