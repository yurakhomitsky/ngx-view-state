import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ngx-loading-state',
  template: '<p>Loading...</p> ',
  styles: [
    `
      :host {
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingStateComponent {}
