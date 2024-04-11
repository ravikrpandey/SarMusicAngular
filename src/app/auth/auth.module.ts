import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { UserLoginComponent } from '../auth/user-login/user-login.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import {UserLoginComponent} from '../auth/user-login/user-login.component'


@NgModule({
  declarations: [
    UserLoginComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
  ]
})
export class AuthModule { }
