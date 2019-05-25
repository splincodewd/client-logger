import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as devtools from 'devtools-detect';
import { Examples } from './examples/examples.class';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  public loaded: boolean;
  public devToolsIsOpen: boolean = environment.stackblitz || devtools.open;
  public LoggerExamplesTemplate = Examples;

  public ngOnInit() {
    this.loaded = true;
    window.addEventListener('devtoolschange', (e) => {
      this.devToolsIsOpen = e['detail']['open'];
    });
  }
}
