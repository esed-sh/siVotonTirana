import { Component } from '@angular/core';
import {HeaderComponent} from './header/header.component';
import {MainContentComponent} from './main-content/main-content.component';

@Component({
    selector: 'app-root',
  imports: [
    HeaderComponent,
    MainContentComponent
  ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'siVotonTirana-frontend';
}
