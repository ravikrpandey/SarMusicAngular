import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumRoutingModule } from './album-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AlbumCreateComponent } from './album-create/album-create.component';
import { AlbumListComponent } from './album-list/album-list.component';
import { AlbumEditComponent } from './album-edit/album-edit.component';


@NgModule({
  declarations: [AlbumCreateComponent, AlbumListComponent, AlbumEditComponent],
  imports: [
    CommonModule,
    AlbumRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AlbumModule { }
