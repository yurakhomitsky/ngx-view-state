import { AsyncPipe } from '@angular/common';
import { Component, provideExperimentalZonelessChangeDetection, signal, Signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';

import { ErrorStateComponent, LoadingStateComponent } from './components';
import { ViewStatusEnum } from './models/view-status.enum';
import { errorViewStatus, idleViewStatus, loadedViewStatus, loadingViewStatus } from './factories';
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
      private viewStatus$ = signal<ViewStatus | null>(null);
      public viewStatusSubject$: Subject<ViewStatus | null> = new Subject<ViewStatus | null>();

      public get viewStatus(): ViewStatus | null {
        return this.viewStatus$()
      }

      setViewStatus(status: ViewStatus | null): void {
        this.viewStatus$.set(status)
        this.viewStatusSubject$.next(status);
      }
    }

    let fixture: ComponentFixture<TestViewStatusHostComponent>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [TestViewStatusHostComponent, NoopAnimationsModule],
        providers: [provideExperimentalZonelessChangeDetection()]
      });
      fixture = TestBed.createComponent(TestViewStatusHostComponent);
      await fixture.whenStable();
    });

    it('should not display the Content if viewStatus is null', async () => {
      fixture.componentInstance.setViewStatus(null)
      await fixture.whenStable();

      expect(fixture.debugElement.query(By.css('.static-content'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('.async-content'))).toBeFalsy();
    });

    it('should not display the Content for [ERROR, LOADING, EMPTY]', async () => {
      fixture.componentInstance.setViewStatus(errorViewStatus());
      await fixture.whenStable();

      expect(fixture.debugElement.query(By.css('.static-content'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('.async-content'))).toBeFalsy();

      fixture.componentInstance.setViewStatus(loadingViewStatus());

      await fixture.whenStable();

      expect(fixture.debugElement.query(By.css('.static-content'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('.async-content'))).toBeFalsy();

    });

    describe('Directive Context', () => {
      it('should display value from the directive context', async () => {
        fixture.componentInstance.setViewStatus(loadedViewStatus());
        await fixture.whenStable();

        expect(fixture.debugElement.query(By.css('.static-content')).nativeElement.textContent).toContain(
          `Content static ${ViewStatusEnum.LOADED}`,
        );
        expect(fixture.debugElement.query(By.css('.async-content')).nativeElement.textContent).toContain(
          `Content async pipe ${ViewStatusEnum.LOADED}`,
        );
      });
    });

    describe('Idle', () => {
      beforeEach(async () => {
        fixture.componentInstance.setViewStatus(idleViewStatus());
        await fixture.whenStable();
      });

      it('should display static content', () => {
        expect(fixture.debugElement.query(By.css('.static-content'))).toBeTruthy();
      });

      it('should display async content', () => {
        expect(fixture.debugElement.query(By.css('.async-content'))).toBeTruthy();
      });
    });

    describe('Loading', () => {
      it('should display the Loading State Component if viewStatus is null', async () => {
        fixture.componentInstance.setViewStatus(null)
        await fixture.whenStable();


        expect(fixture.debugElement.queryAll(By.directive(LoadingStateComponent)).length).toBe(2);
      });

      it('should Loading State Component', async () => {
        fixture.componentInstance.setViewStatus(loadingViewStatus());
        await fixture.whenStable();

        expect(fixture.debugElement.queryAll(By.directive(LoadingStateComponent)).length).toBe(2)
      });
    });

    describe('Loaded', () => {
      beforeEach(async () => {
        fixture.componentInstance.setViewStatus(loadedViewStatus());
        await fixture.whenStable();
      });

      it('should display static content', () => {
        expect(fixture.debugElement.query(By.css('.static-content'))).toBeTruthy();
      });

      it('should display async content', () => {
        expect(fixture.debugElement.query(By.css('.async-content'))).toBeTruthy();
      });

    });

    describe('Error', () => {
      it('should display the Error State Component', async () => {
        fixture.componentInstance.setViewStatus(errorViewStatus('Something went wrong'));
        await fixture.whenStable();

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
      private _viewModel = signal<ComponentViewModel<string>>({
        viewStatus: loadedViewStatus(),
        data: 'Hello World',
      })

      public set viewModel(viewModel: ComponentViewModel<string>) {
        this._viewModel.set(viewModel)
      }

      public get viewModel(): ComponentViewModel<string> {
        return this._viewModel()
      }


    }

    let fixture: ComponentFixture<TestViewModelHostComponent>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [TestViewModelHostComponent, NoopAnimationsModule],
        providers: [provideExperimentalZonelessChangeDetection()]
      });
      fixture = TestBed.createComponent(TestViewModelHostComponent);
      await fixture.whenStable()
    });

    describe('Directive Context', () => {
      it('should display data from directive context', async () => {
        fixture.componentInstance.viewModel = {
          viewStatus: loadedViewStatus(),
          data: 'Hello World',
        };
        await fixture.whenStable();

        expect(fixture.debugElement.query(By.css('.viewModel-content')).nativeElement.textContent).toContain(
          'View Model Content Hello World',
        );
      });

      it('should update data from directive context even when the viewStatus is the same', async () => {
        fixture.componentInstance.viewModel = {
          viewStatus: loadedViewStatus(),
          data: 'Hello World',
        };

        await fixture.whenStable();

        expect(fixture.debugElement.query(By.css('.viewModel-content')).nativeElement.textContent).toContain(
          'View Model Content Hello World',
        );

        fixture.componentInstance.viewModel = {
          viewStatus: loadedViewStatus(),
          data: 'Hello World 2',
        };
        await fixture.whenStable();

        expect(fixture.debugElement.query(By.css('.viewModel-content')).nativeElement.textContent).toContain(
          'View Model Content Hello World 2',
        );
      });
    });

    describe('Idle', () => {
      it('should display  content', async () => {
        fixture.componentInstance.viewModel = {
          viewStatus: idleViewStatus(),
          data: 'Hello World',
        };
        await fixture.whenStable();

        expect(fixture.debugElement.query(By.css('.viewModel-content'))).toBeTruthy();
      });
    });

    describe('Loading', () => {
      it('should Loading State Component', async () => {
        fixture.componentInstance.viewModel = {
          viewStatus: loadingViewStatus(),
        };
        await fixture.whenStable();

        expect(fixture.debugElement.queryAll(By.directive(LoadingStateComponent)).length).toBe(1);
      });
    });

    describe('Loaded', () => {
      it('should display content', async () => {
        fixture.componentInstance.viewModel = {
          viewStatus: loadedViewStatus(),
          data: 'Hello World',
        };
        await fixture.whenStable();

        expect(fixture.debugElement.query(By.css('.viewModel-content'))).toBeTruthy();
      });
    });

    describe('Error', () => {
      it('should display the Error State Component', async () => {
        fixture.componentInstance.viewModel = {
          viewStatus: errorViewStatus(),
        };

        await fixture.whenStable();

        expect(fixture.debugElement.queryAll(By.directive(ErrorStateComponent)).length).toBe(1);
      });
    });
  });
});
