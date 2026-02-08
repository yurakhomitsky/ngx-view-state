import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';

import { ViewStateErrorProps } from '../models/view-state-props.model';
import { ViewStateActionsService } from '../services/view-state-actions.service';

import { ViewStateActions } from './view-state.actions';
import { ViewStateEffects } from './view-state.effects';
import { provideZonelessChangeDetection } from '@angular/core';

describe('ViewStateEffects', () => {
  let actions$: ReplaySubject<Action>;
  let effects: ViewStateEffects;
  const viewStateActionsServiceSpy = {
    add: vi.fn().mockName('ViewStateActionsService.add'),
    isStartLoadingAction: vi.fn().mockName('ViewStateActionsService.isStartLoadingAction'),
    isErrorAction: vi.fn().mockName('ViewStateActionsService.isErrorAction'),
    isResetLoadingAction: vi.fn().mockName('ViewStateActionsService.isResetLoadingAction'),
    getResetActionTypes: vi.fn().mockName('ViewStateActionsService.getResetActionTypes'),
    getErrorActionTypes: vi.fn().mockName('ViewStateActionsService.getErrorActionTypes'),
    isViewStateAction: vi.fn().mockName('ViewStateActionsService.isViewStateAction'),
  };

  beforeEach(() => {
    actions$ = new ReplaySubject(1);

    TestBed.configureTestingModule({
      providers: [
        ViewStateEffects,
        provideMockActions(() => actions$),
        { provide: ViewStateActionsService, useValue: viewStateActionsServiceSpy },
        provideZonelessChangeDetection(),
      ],
    });

    viewStateActionsServiceSpy.isViewStateAction.mockReturnValue(true);

    effects = TestBed.inject(ViewStateEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  describe('startLoading$', () => {
    it('should map to startLoading action', async () => {
      const loadData: Action = { type: 'loadData' };

      effects.startLoading$.subscribe((action) => {
        expect(action).toEqual(ViewStateActions.startLoading({ actionType: loadData.type }));
      });

      viewStateActionsServiceSpy.isStartLoadingAction.mockReturnValue(true);

      actions$.next(loadData);
    });

    it('should not map to startLoading action', () => {
      const loadData: Action = { type: 'loadData' };

      const spy = vi.fn();

      effects.startLoading$.subscribe(spy);

      viewStateActionsServiceSpy.isStartLoadingAction.mockReturnValue(false);

      actions$.next(loadData);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('reset$', () => {
    it('should map to resetMany action', async () => {
      const loadDataSuccess: Action = { type: 'loadDataSuccess' };

      effects.reset$.subscribe((action) => {
        expect(action).toEqual(ViewStateActions.resetMany({ actionTypes: ['loadData'] }));
      });

      viewStateActionsServiceSpy.isResetLoadingAction.mockReturnValue(true);
      viewStateActionsServiceSpy.getResetActionTypes.mockReturnValue(['loadData']);

      actions$.next(loadDataSuccess);
    });

    it('should not map to reset action', () => {
      const someAction: Action = { type: 'some action' };
      const spy = vi.fn();

      effects.reset$.subscribe(spy);

      viewStateActionsServiceSpy.isResetLoadingAction.mockReturnValue(false);

      actions$.next(someAction);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('error$', () => {
    it('should map to errorMany action', async () => {
      const loadDataFailure: Action & ViewStateErrorProps<string> = {
        type: 'loadDataFailure',
        viewStateError: 'custom error message',
      };

      effects.error$.subscribe((action) => {
        expect(action).toEqual(
          ViewStateActions.errorMany({
            actionTypes: [{ actionType: 'loadData', error: loadDataFailure.viewStateError ?? '' }],
          })
        );
      });

      viewStateActionsServiceSpy.isErrorAction.mockReturnValue(true);
      viewStateActionsServiceSpy.getErrorActionTypes.mockReturnValue(['loadData']);

      actions$.next(loadDataFailure);
    });

    it('should not map to error action', () => {
      const someAction: Action = { type: 'some action' };
      const spy = vi.fn();

      effects.error$.subscribe(spy);

      viewStateActionsServiceSpy.isErrorAction.mockReturnValue(false);

      actions$.next(someAction);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
