import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// debugger
const routes: Routes = [
  {path:'', redirectTo:'auth', pathMatch:'full'},
  { path: 'auth', loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule) },
  { path: 'main', loadChildren: () => import('../app/@modules/main.module').then(m => m.MainModule) },
  { path: 'admin', loadChildren: () => import('../app/admin/admin-menu/admin-menu.module').then(m => m.AdminMenuModule) }

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
