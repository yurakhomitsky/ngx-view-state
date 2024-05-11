import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <mat-icon class="empty-state-icon" svgIcon="info"> </mat-icon>
    <h2>{{ emptyTextTitle || 'No results found' }}</h2>
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

      .empty-state-icon {
        height: 4rem;
        width: 4rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  @Input() public emptyTextTitle?: string;
}
