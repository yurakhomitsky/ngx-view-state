import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ViewStateErrorComponent } from '../../models/view-state-component.model';

@Component({
  selector: 'ngx-error-state',
  template: ` <h2>{{ viewStateError || 'There is an error displaying this data' }}</h2> `,
  styles: [
    `
      :host {
        display: flex;
        height: 100%;
        width: 100%;
        gap: 1rem;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent implements ViewStateErrorComponent<string> {
  @Input() public viewStateError!: string;
}
