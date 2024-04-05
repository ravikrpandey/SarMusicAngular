import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';


@NgModule({
  declarations: [DashboardListComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class DashboardModule { }
