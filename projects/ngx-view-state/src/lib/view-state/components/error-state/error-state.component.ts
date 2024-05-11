import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <mat-icon class="error-state-icon" svgIcon="error"></mat-icon>
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

      .error-state-icon {
        height: 4rem;
        width: 4rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent {
  @Input() public errorMessage?: string;
}
