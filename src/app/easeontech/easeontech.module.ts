import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EaseontechComponent } from './easeontech.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: EaseontechComponent }
];

@NgModule({
  declarations: [
    EaseontechComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class EaseontechModule { } 