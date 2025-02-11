import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';

import { ErrorStateComponent } from './error-state.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ErrorStateComponent, MatIconTestingModule],
      providers: [provideExperimentalZonelessChangeDetection()]
    });
    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default error text', () => {
    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('There is an error displaying this data');
  });

  it('should display custom error text', async () => {
    component.viewStateError = 'Custom error text';

    fixture.componentRef.setInput('viewStateError', 'Custom error text');
    await fixture.whenStable();

    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('Custom error text');
  });
});
