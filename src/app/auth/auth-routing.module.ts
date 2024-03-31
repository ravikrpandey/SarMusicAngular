import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { UserLoginComponent } from '../user-login/user-login.component';
import {UserLoginComponent} from '../auth/user-login/user-login.component'

const routes: Routes = [
  {path:'', component:UserLoginComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
