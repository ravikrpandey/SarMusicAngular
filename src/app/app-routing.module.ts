import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

// debugger
const routes: Routes = [
  {path:'', redirectTo:'auth', pathMatch:'full'},
  { path: 'auth', loadChildren: () => import('../app/auth/auth.module').then(m => m.AuthModule), },
  { path: 'main', loadChildren: () => import('../app/@modules/main.module').then(m => m.MainModule), canActivate: [AuthGuard] },
  { path: 'admin', loadChildren: () => import('../app/admin/admin-menu/admin-menu.module').then(m => m.AdminMenuModule), canActivate: [AuthGuard]  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
