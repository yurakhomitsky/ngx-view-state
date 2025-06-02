import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingStateComponent } from './loading-state.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('LoadingStateComponent', () => {
  let component: LoadingStateComponent;
  let fixture: ComponentFixture<LoadingStateComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [LoadingStateComponent],
      providers: [provideExperimentalZonelessChangeDetection()],
    });
    fixture = TestBed.createComponent(LoadingStateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
