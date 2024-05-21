import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

import { ViewStateErrorProps } from '../models/view-state-props.model';
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
    'getActionType',
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
        expect(action).toEqual(ViewStateActions.startLoading({ actionType: loadData.type }));
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
        expect(action).toEqual(ViewStateActions.reset({ actionType: 'loadData' }));
        done();
      });

      viewStateActionsServiceSpy.isResetLoadingAction.and.returnValue(true);
      viewStateActionsServiceSpy.getActionType.and.returnValue('loadData');

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
      const loadDataFailure: Action & ViewStateErrorProps<string> = { type: 'loadDataFailure', error: 'custom error message' };

      effects.error$.subscribe((action) => {
        expect(action).toEqual(ViewStateActions.error({ actionType: 'loadData', error: loadDataFailure.error ?? '' }));
        done();
      });

      viewStateActionsServiceSpy.isErrorAction.and.returnValue(true);
      viewStateActionsServiceSpy.getActionType.and.returnValue('loadData');

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
