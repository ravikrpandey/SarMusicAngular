import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {path:'',component:MainComponent},
  { path: 'stream', loadChildren: () => import('../@modules/stream/stream.module').then(m => m.StreamModule) },
  // { path: 'admin-menu', loadChildren: () => import('../@modules/admin-menu/admin-menu.module').then(m => m.AdminMenuModule) }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
