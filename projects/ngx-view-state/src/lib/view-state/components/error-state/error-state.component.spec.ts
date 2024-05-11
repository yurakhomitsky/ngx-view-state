import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { By } from '@angular/platform-browser';

import { ErrorStateComponent } from './error-state.component';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ErrorStateComponent, MatIconTestingModule],
    });
    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default error text', () => {
    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('There is an error displaying this data');
  });

  it('should display custom error text', () => {
    component.errorMessage = 'Custom error text';

    fixture.componentRef.setInput('errorMessage', 'Custom error text');
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('Custom error text');
  });
});
