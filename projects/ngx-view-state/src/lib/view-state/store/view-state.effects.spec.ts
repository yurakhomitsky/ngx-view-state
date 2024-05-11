import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

import { ViewStateErrorProps, ViewStateSuccessProps } from '../models/view-state-props';
import { ViewStateActionsService } from '../services/view-state-actions.service';

import { ViewStateActions } from './view-state.actions';
import { ViewStateEffects } from './view-state.effects';

describe('ViewStateEffects', () => {
  let actions$: ReplaySubject<Action>;
  let effects: ViewStateEffects;
  const viewStateActionsServiceSpy = jasmine.createSpyObj<ViewStateActionsService>('ViewStateActionsService', [
    'add',
    'isStartLoadingAction',
    'isErrorAction',
    'isResetLoadingAction',
    'getResetLoadingId',
  ]);

  beforeEach(() => {
    actions$ = new ReplaySubject(1);

    TestBed.configureTestingModule({
      providers: [
        ViewStateEffects,
        provideMockActions(() => actions$),
        { provide: ViewStateActionsService, useValue: viewStateActionsServiceSpy },
      ],
    });

    effects = TestBed.inject(ViewStateEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('startLoading$', () => {
    it('should map to startLoading action', (done) => {
      const loadData: Action = { type: 'loadData' };

      effects.startLoading$.subscribe((action) => {
        expect(action).toEqual(ViewStateActions.startLoading({ id: loadData.type }));
        done();
      });

      viewStateActionsServiceSpy.isStartLoadingAction.and.returnValue(true);

      actions$.next(loadData);
    });

    it('should not map to startLoading action', () => {
      const loadData: Action = { type: 'loadData' };

      const spy = jasmine.createSpy();

      effects.startLoading$.subscribe(spy);

      viewStateActionsServiceSpy.isStartLoadingAction.and.returnValue(false);

      actions$.next(loadData);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('reset$', () => {
    it('should map to reset action', (done) => {
      const loadDataSuccess: Action = { type: 'loadDataSuccess' };

      effects.reset$.subscribe((action) => {
        expect(action).toEqual(ViewStateActions.reset({ id: 'loadData' }));
        done();
      });

      viewStateActionsServiceSpy.isResetLoadingAction.and.returnValue(true);
      viewStateActionsServiceSpy.getResetLoadingId.and.returnValue('loadData');

      actions$.next(loadDataSuccess);
    });

    it('should map to empty action', (done) => {
      const loadDataSuccess: Action & ViewStateSuccessProps = {
        type: 'loadDataSuccess',
        isDataEmpty: true,
        emptyText: 'custom empty text',
      };

      effects.reset$.subscribe((action) => {
        expect(action).toEqual(ViewStateActions.empty({ id: 'loadData', emptyMessage: loadDataSuccess.emptyText ?? '' }));
        done();
      });

      viewStateActionsServiceSpy.isResetLoadingAction.and.returnValue(true);
      viewStateActionsServiceSpy.getResetLoadingId.and.returnValue('loadData');

      actions$.next(loadDataSuccess);
    });

    it('should not map to reset action', () => {
      const someAction: Action = { type: 'some action' };
      const spy = jasmine.createSpy();

      effects.reset$.subscribe(spy);

      viewStateActionsServiceSpy.isResetLoadingAction.and.returnValue(false);

      actions$.next(someAction);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('error$', () => {
    it('should map to error action', (done) => {
      const loadDataFailure: Action & ViewStateErrorProps = { type: 'loadDataFailure', errorMessage: 'custom error message' };

      effects.error$.subscribe((action) => {
        expect(action).toEqual(ViewStateActions.error({ id: 'loadData', errorMessage: loadDataFailure.errorMessage ?? '' }));
        done();
      });

      viewStateActionsServiceSpy.isErrorAction.and.returnValue(true);
      viewStateActionsServiceSpy.getResetLoadingId.and.returnValue('loadData');

      actions$.next(loadDataFailure);
    });

    it('should not map to error action', () => {
      const someAction: Action = { type: 'some action' };
      const spy = jasmine.createSpy();

      effects.error$.subscribe(spy);

      viewStateActionsServiceSpy.isErrorAction.and.returnValue(false);

      actions$.next(someAction);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
