import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SongsRoutingModule } from './songs-routing.module';
import { SongCreateComponent } from './song-create/song-create.component';
import { SongEditComponent } from './song-edit/song-edit.component';
import { SongListComponent } from './song-list/song-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from 'src/app/app.component';


@NgModule({
  declarations: [SongCreateComponent, SongEditComponent, SongListComponent],
  imports: [
    CommonModule,
    SongsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class SongsModule { }
