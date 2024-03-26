import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-tour-of-heroes';

  ravi = {
    name: 'tour-of-heroes',
    id: 1,
    canFly: false

  }
}
