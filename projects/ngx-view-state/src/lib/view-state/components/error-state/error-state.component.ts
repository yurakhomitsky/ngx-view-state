import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [],
  template: `
    <h2>{{ errorMessage || 'There is an error displaying this data' }}</h2>
  `,
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
export class ErrorStateComponent {
  @Input() public errorMessage?: string;
}
