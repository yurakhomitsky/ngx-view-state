import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import { ErrorStateComponent, LoadingStateComponent } from './components';
import { ViewStatusEnum } from './models/view-status.enum';
import {  errorViewStatus, idleViewStatus, loadedViewStatus, loadingViewStatus } from './factories';
import { ViewStatus } from './models/view-status.model';
import { ViewStateDirective } from './view-state.directive';
import { ComponentViewModel } from './models/component-view-model.model';

describe('ViewStateDirective', () => {
  describe('viewStatus', () => {
    @Component({
      selector: 'app-test-host',
      template: `
        <div *ngxViewState="viewStatus as viewStatusContext" class="static-content">Content static {{ viewStatusContext.type }}</div>
        <div *ngxViewState="viewStatusSubject$ | async as viewStatusContext" class="async-content">
          Content async pipe {{ viewStatusContext.type }}
        </div>
      `,
      imports: [ViewStateDirective, AsyncPipe],
    })
    class TestViewStatusHostComponent {
      public viewStatus: ViewStatus | null = null;
      public viewStatusSubject$ = new Subject<ViewStatus>();

      setViewStatus(status: ViewStatus): void {
        this.viewStatus = status;
        this.viewStatusSubject$.next(status);
      }
    }

    let fixture: ComponentFixture<TestViewStatusHostComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestViewStatusHostComponent, NoopAnimationsModule],
      });
      fixture = TestBed.createComponent(TestViewStatusHostComponent);
      fixture.detectChanges();
    });

    it('should not display the Content if viewStatus is null', () => {
      fixture.componentInstance.viewStatus = null;
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.static-content'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('.async-content'))).toBeFalsy();
    });

    it('should not display the Content for [ERROR, LOADING, EMPTY]', () => {
      fixture.componentInstance.setViewStatus(errorViewStatus());

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.static-content'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('.async-content'))).toBeFalsy();

      fixture.componentInstance.setViewStatus(loadingViewStatus());

      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('.static-content'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('.async-content'))).toBeFalsy();

    });

    describe('Directive Context', () => {
      it('should display value from the directive context', () => {
        fixture.componentInstance.setViewStatus(loadedViewStatus());
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('.static-content')).nativeElement.textContent).toContain(
          `Content static ${ViewStatusEnum.LOADED}`,
        );
        expect(fixture.debugElement.query(By.css('.async-content')).nativeElement.textContent).toContain(
          `Content async pipe ${ViewStatusEnum.LOADED}`,
        );
      });
    });

    describe('Idle', () => {
      beforeEach(() => {
        fixture.componentInstance.setViewStatus(idleViewStatus());
        fixture.detectChanges();
      });

      it('should display static content', () => {
        expect(fixture.debugElement.query(By.css('.static-content'))).toBeTruthy();
      });

      it('should display async content', () => {
        expect(fixture.debugElement.query(By.css('.async-content'))).toBeTruthy();
      });
    });

    describe('Loading', () => {
      it('should display the Loading State Component if viewStatus is null', () => {
        fixture.componentInstance.viewStatus = null;
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.directive(LoadingStateComponent)).length).toBe(2);
      });

      it('should Loading State Component', () => {
        fixture.componentInstance.setViewStatus(loadingViewStatus());
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.directive(LoadingStateComponent)).length).toBe(2)
      });
    });

    describe('Loaded', () => {
      beforeEach(() => {
        fixture.componentInstance.setViewStatus(loadedViewStatus());
        fixture.detectChanges();
      });

      it('should display static content', () => {
        expect(fixture.debugElement.query(By.css('.static-content'))).toBeTruthy();
      });

      it('should display async content', () => {
        expect(fixture.debugElement.query(By.css('.async-content'))).toBeTruthy();
      });

    });

    describe('Error', () => {
      it('should display the Error State Component', () => {
        fixture.componentInstance.setViewStatus(errorViewStatus('Something went wrong'));

        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.directive(ErrorStateComponent)).length).toBe(2)
        expect(fixture.debugElement.query(By.css('h2')).nativeElement.textContent).toContain('Something went wrong');
      });
    });
  });

  describe('viewModel', () => {
    @Component({
      selector: 'app-test-host',
      template: `
        <div *ngxViewState="viewModel as viewModelContext" class="viewModel-content">View Model Content {{ viewModelContext.data }}</div>
      `,
      imports: [ViewStateDirective],
    })
    class TestViewModelHostComponent {
      public viewModel: ComponentViewModel<string> = {
        viewStatus: loadedViewStatus(),
        data: 'Hello World',
      };
    }

    let fixture: ComponentFixture<TestViewModelHostComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestViewModelHostComponent, NoopAnimationsModule],
      });
      fixture = TestBed.createComponent(TestViewModelHostComponent);
      fixture.detectChanges();
    });

    describe('Directive Context', () => {
      it('should display data from directive context', () => {
        fixture.componentInstance.viewModel = {
          viewStatus: loadedViewStatus(),
          data: 'Hello World',
        };
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('.viewModel-content')).nativeElement.textContent).toContain(
          'View Model Content Hello World',
        );
      });
    });

    describe('Idle', () => {
      it('should display  content', () => {
        fixture.componentInstance.viewModel = {
          viewStatus: idleViewStatus(),
          data: 'Hello World',
        };
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('.viewModel-content'))).toBeTruthy();
      });
    });

    describe('Loading', () => {
      it('should Loading State Component', () => {
        fixture.componentInstance.viewModel = {
          viewStatus: loadingViewStatus(),
        };
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.directive(LoadingStateComponent)).length).toBe(1);
      });
    });

    describe('Loaded', () => {
      it('should display content', () => {
        fixture.componentInstance.viewModel = {
          viewStatus: loadedViewStatus(),
          data: 'Hello World',
        };
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('.viewModel-content'))).toBeTruthy();
      });
    });

    describe('Error', () => {
      it('should display the Error State Component', () => {
        fixture.componentInstance.viewModel = {
          viewStatus: errorViewStatus(),
        };
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.directive(ErrorStateComponent)).length).toBe(1);
      });
    });
  });
});
