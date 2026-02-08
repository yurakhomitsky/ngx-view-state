import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Injectable, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Actions, createEffect, ofType, provideEffects } from '@ngrx/effects';
import { Action, createActionGroup, emptyProps, props, provideState, provideStore, Store } from '@ngrx/store';
import {
  asyncScheduler,
  catchError,
  firstValueFrom,
  Observable,
  observeOn,
  of,
  Subject,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { map, take, toArray } from 'rxjs/operators';

import { ViewStateErrorProps } from '../models/view-state-props.model';
import { ViewStateActionsService } from '../services/view-state-actions.service';

import { ViewStateActions } from './view-state.actions';
import { ViewStateEffects } from './view-state.effects';
import { createViewStateFeature } from './view-state.feature';
import { ViewStatus } from '../models/view-status.model';
import { errorViewStatus, idleViewStatus, loadingViewStatus } from '../factories';

describe('ViewStateIntegration', () => {
  let store: Store;
  let actions$: Actions;
  const loadFailError = 'Failed to Load Data';
  const addFailError = 'Failed to Add Data';

  const { viewStatesFeature, selectActionViewStatus } = createViewStateFeature<string>();

  let apiService: {
    getData: () => Observable<string[]>;
    addData: (data: string) => Observable<string>;
  };

  const DataActions = createActionGroup({
    source: 'Data',
    events: {
      loadData: emptyProps(),
      loadDataSuccess: props<{
        data: string[];
      }>(),
      loadDataFailure: props<ViewStateErrorProps>(),

      addData: props<{
        data: string;
      }>(),
      addDataSuccess: props<{
        data: string;
      }>(),
      addDataFailure: props<ViewStateErrorProps>(),

      loadBooks: emptyProps(),
      loadBooksSuccess: emptyProps(),
      loadBooksFailure: props<
        ViewStateErrorProps<{
          message: string;
        }>
      >(),

      saveBook: emptyProps(),
      saveBookSuccess: emptyProps(),
    },
  });

  beforeEach(() => {
    apiService = {
      getData: () => of<string[]>([]),
      addData: (data: string) => of(data),
    };

    @Injectable()
    class DataEffects {
      public getData$ = this.getData();
      public addData$ = this.addData();

      constructor(
        private actions$: Actions,
        private viewStateActionsService: ViewStateActionsService
      ) {
        this.viewStateActionsService.add([
          {
            startLoadingOn: DataActions.loadData,
            resetOn: [DataActions.loadDataSuccess, DataActions.addData],
            errorOn: [DataActions.loadDataFailure, DataActions.addDataFailure],
          },
          {
            startLoadingOn: DataActions.addData,
            resetOn: [DataActions.addDataSuccess],
            errorOn: [DataActions.addDataFailure],
          },
          {
            startLoadingOn: DataActions.loadBooks,
            resetOn: [DataActions.loadBooksSuccess],
            errorOn: [DataActions.loadBooksFailure],
          },
          {
            startLoadingOn: DataActions.saveBook,
            resetOn: [DataActions.saveBookSuccess],
            errorOn: [],
          },
        ]);
      }

      private getData() {
        return createEffect(() => {
          return this.actions$.pipe(
            ofType(DataActions.loadData),
            switchMap(() => {
              return apiService.getData().pipe(
                map((data: string[]) => {
                  return DataActions.loadDataSuccess({
                    data,
                  });
                }),
                catchError(() => {
                  return of(DataActions.loadDataFailure({ viewStateError: loadFailError }));
                })
              );
            })
          );
        });
      }

      private addData() {
        return createEffect(() => {
          return this.actions$.pipe(
            ofType(DataActions.addData),
            switchMap(({ data }) => {
              return apiService.addData(data).pipe(
                map(() => {
                  return DataActions.addDataSuccess({
                    data,
                  });
                }),
                catchError(() => {
                  return of(DataActions.addDataFailure({ viewStateError: addFailError }));
                })
              );
            })
          );
        });
      }
    }

    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideEffects(ViewStateEffects, DataEffects),
        provideState(viewStatesFeature),
        provideZonelessChangeDetection(),
      ],
    });

    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
  });

  describe('loadData action', () => {
    it('should handle success data loading correctly', async () => {
      const dataExpected: Action[] = [
        DataActions.loadData(),
        ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
        DataActions.loadDataSuccess({ data: ['Hello', 'Word'] }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
      ];

      actions$.pipe(take(dataExpected.length), toArray()).subscribe((result) => {
        expect(dataExpected).toEqual(result);
      });

      vi.spyOn(apiService, 'getData').mockReturnValue(of(['Hello', 'Word']));

      store.dispatch(DataActions.loadData());
    });

    it('should handle failure data loading correctly', async () => {
      const dataExpected: Action[] = [
        DataActions.loadData(),
        ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
        DataActions.loadDataFailure({ viewStateError: loadFailError }),
        ViewStateActions.errorMany({ actionTypes: [{ actionType: DataActions.loadData.type, error: loadFailError }] }),
      ];

      actions$.pipe(take(dataExpected.length), toArray()).subscribe((result) => {
        expect(dataExpected).toEqual(result);
      });

      vi.spyOn(apiService, 'getData').mockReturnValue(throwError(() => new Error('Oops')));

      store.dispatch(DataActions.loadData());
    });
  });

  describe('addData action', () => {
    it('should handle success data adding correctly', async () => {
      const dataExpected: Action[] = [
        DataActions.addData({ data: 'Hello' }),
        ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
        DataActions.addDataSuccess({ data: 'Hello' }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.addData.type] }),
      ];

      actions$.pipe(take(dataExpected.length), toArray()).subscribe((result) => {
        expect(dataExpected).toEqual(result);
      });

      vi.spyOn(apiService, 'addData').mockReturnValue(of('Hello'));

      store.dispatch(DataActions.addData({ data: 'Hello' }));
    });

    it('should handle failure data adding correctly', async () => {
      const dataExpected: Action[] = [
        DataActions.addData({ data: 'Hello Oops' }),
        ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
        DataActions.addDataFailure({ viewStateError: addFailError }),
        ViewStateActions.errorMany({
          actionTypes: [
            { actionType: DataActions.loadData.type, error: addFailError },
            { actionType: DataActions.addData.type, error: addFailError },
          ],
        }),
      ];

      actions$.pipe(take(dataExpected.length), toArray()).subscribe((result) => {
        expect(dataExpected).toEqual(result);
      });

      vi.spyOn(apiService, 'addData').mockReturnValue(throwError(() => new Error('Oops')));

      store.dispatch(DataActions.addData({ data: 'Hello Oops' }));
    });
  });

  describe('[Async] loadData action and addData action', () => {
    it('should reset loadData action after addData action', async () => {
      const dataExpected: Action[] = [
        DataActions.loadData(),
        ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
        DataActions.addData({ data: 'Add Hello' }),
        ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
        DataActions.addDataSuccess({ data: 'Add Hello' }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.addData.type] }),
        DataActions.loadDataSuccess({ data: ['Hello', 'World'] }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
      ];

      const actions = firstValueFrom(actions$.pipe(take(dataExpected.length), toArray()));

      vi.useFakeTimers();
      vi.spyOn(apiService, 'getData').mockReturnValue(of(['Hello', 'World']).pipe(observeOn(asyncScheduler)));

      store.dispatch(DataActions.loadData());
      store.dispatch(DataActions.addData({ data: 'Add Hello' }));
      vi.advanceTimersByTime(1);

      const result = await actions;

      expect(dataExpected).toEqual(result);

      vi.useRealTimers();
    });

    it('should error loadData action after addData action', async () => {
      const dataExpected: Action[] = [
        DataActions.loadData(),
        ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
        DataActions.addData({ data: 'Add Hello Oops' }),
        ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
        DataActions.addDataFailure({ viewStateError: addFailError }),
        ViewStateActions.errorMany({
          actionTypes: [
            {
              actionType: DataActions.loadData.type,
              error: addFailError,
            },
            { actionType: DataActions.addData.type, error: addFailError },
          ],
        }),
        DataActions.loadDataSuccess({ data: ['Hello', 'World'] }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
      ];

      const actions = firstValueFrom(actions$.pipe(take(dataExpected.length), toArray()));

      vi.spyOn(apiService, 'getData').mockReturnValue(of(['Hello', 'World']).pipe(observeOn(asyncScheduler)));

      vi.spyOn(apiService, 'addData').mockReturnValue(throwError(() => new Error('Oops')));

      store.dispatch(DataActions.loadData());
      store.dispatch(DataActions.addData({ data: 'Add Hello Oops' }));

      const result = await actions;

      expect(dataExpected).toEqual(result);
    });
  });

  describe('[SYNC] loadData action and addData action', () => {
    it('should reset loadData action after addData action', async () => {
      const dataExpected: Action[] = [
        DataActions.loadData(),
        ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
        DataActions.loadDataSuccess({ data: ['Hello', 'World'] }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
        DataActions.addData({ data: 'Add Hello' }),
        ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
        DataActions.addDataSuccess({ data: 'Add Hello' }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.addData.type] }),
      ];

      const actions = firstValueFrom(actions$.pipe(take(dataExpected.length), toArray()));

      vi.spyOn(apiService, 'getData').mockReturnValue(of(['Hello', 'World']));

      store.dispatch(DataActions.loadData());
      store.dispatch(DataActions.addData({ data: 'Add Hello' }));

      const result = await actions;

      expect(dataExpected).toEqual(result);
    });

    it('should error loadData action after addData action', async () => {
      const dataExpected: Action[] = [
        DataActions.loadData(),
        ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
        DataActions.loadDataSuccess({ data: ['Hello', 'World'] }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
        DataActions.addData({ data: 'Add Hello Oops' }),
        ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
        ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
        DataActions.addDataFailure({ viewStateError: addFailError }),
        ViewStateActions.errorMany({
          actionTypes: [
            {
              actionType: DataActions.loadData.type,
              error: addFailError,
            },
            { actionType: DataActions.addData.type, error: addFailError },
          ],
        }),
      ];

      const actions = firstValueFrom(actions$.pipe(take(dataExpected.length), toArray()));

      vi.spyOn(apiService, 'getData').mockReturnValue(of(['Hello', 'World']));
      vi.spyOn(apiService, 'addData').mockReturnValue(throwError(() => new Error('Oops')));

      store.dispatch(DataActions.loadData());
      store.dispatch(DataActions.addData({ data: 'Add Hello Oops' }));

      const result = await actions;

      expect(dataExpected).toEqual(result);
    });
  });

  describe('Select ViewState', () => {
    let viewStatuses: ViewStatus[];
    let subject: Subject<void>;

    beforeEach(() => {
      viewStatuses = [];
      subject = new Subject();
      store
        .select(selectActionViewStatus(DataActions.loadBooks))
        .pipe(takeUntil(subject))
        .subscribe((viewStatus) => {
          viewStatuses.push(viewStatus);
        });
    });

    afterEach(() => {
      subject.next();
      subject.complete();
    });

    it('should not trigger selector when dispatch actions not related to one we listen', () => {
      store.dispatch(DataActions.loadBooks());
      store.dispatch(DataActions.loadBooksSuccess());

      store.dispatch(DataActions.saveBook());
      store.dispatch(DataActions.saveBookSuccess());
      store.dispatch(DataActions.saveBookSuccess());

      expect(viewStatuses).toEqual([idleViewStatus(), loadingViewStatus(), idleViewStatus()]);
    });

    it('should not emit duplicated view status', () => {
      store.dispatch(DataActions.loadBooks());
      store.dispatch(DataActions.loadBooks());
      store.dispatch(DataActions.loadBooks());
      store.dispatch(DataActions.loadBooksSuccess());

      expect(viewStatuses).toEqual([idleViewStatus(), loadingViewStatus(), idleViewStatus()]);
    });

    it('should emit error view status when if error object changes', () => {
      store.dispatch(DataActions.loadBooksFailure({ viewStateError: { message: 'Error-1' } }));
      store.dispatch(DataActions.loadBooksFailure({ viewStateError: { message: 'Error-1' } }));
      store.dispatch(DataActions.loadBooksFailure({ viewStateError: { message: 'Error-2' } }));

      expect(viewStatuses).toEqual([
        idleViewStatus(),
        errorViewStatus({ message: 'Error-1' }),
        errorViewStatus({ message: 'Error-1' }),
        errorViewStatus({ message: 'Error-2' }),
      ]);
    });
  });
});
