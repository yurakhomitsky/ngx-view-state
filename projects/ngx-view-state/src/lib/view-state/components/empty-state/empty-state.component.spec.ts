import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmptyStateComponent, MatIconTestingModule],
    });

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default error text', () => {
    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('No results found');
  });

  it('should display custom empty text', () => {
    component.emptyTextTitle = 'Custom empty text';

    fixture.componentRef.setInput('emptyTextTitle', 'Custom empty text');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('Custom empty text');
  });
});
