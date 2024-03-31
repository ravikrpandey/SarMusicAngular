import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminMenuRoutingModule } from './admin-menu-routing.module';
import { AdminMainComponent } from './admin-main.component';


@NgModule({
  declarations: [
    AdminMainComponent
  ],
  imports: [
    CommonModule,
    AdminMenuRoutingModule
  ]
})
export class AdminMenuModule { }
