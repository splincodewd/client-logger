import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as devtools from 'devtools-detect';
import { Examples } from './common/examples';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  public loaded: boolean;
  public devToolsIsOpen: boolean = devtools.open;
  public LoggerExamplesTemplate = Examples;

  public ngOnInit() {
    this.loaded = true;
    window.addEventListener('devtoolschange', (e) => {
      this.devToolsIsOpen = e['detail']['open'];
    });
  }
}
