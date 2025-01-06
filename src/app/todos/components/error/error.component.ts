import { Component, Input } from '@angular/core';
import { ViewStateErrorComponent } from 'ngx-view-state';

@Component({
  selector: 'app-error',
  template: `
    <p>
      Oops! Something went wrong: {{ viewStateError }}
    </p>
  `,
  styles: `
      :host {
          display: flex;
          height: 100%;
          width: 100%;
          justify-content: center;
          align-items: center;
      }`
})
export class ErrorComponent implements ViewStateErrorComponent<string> {
  @Input()
  viewStateError: string = ''
}
