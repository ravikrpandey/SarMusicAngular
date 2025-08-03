import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicisSapientComponent } from './publicis-sapient.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: PublicisSapientComponent }
];

@NgModule({
  declarations: [
    PublicisSapientComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PublicisSapientModule { } 