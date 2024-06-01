import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Actions, createEffect, EffectsModule, ofType } from '@ngrx/effects';
import { Action, createActionGroup, emptyProps, props, Store, StoreModule } from '@ngrx/store';
import { catchError, of, switchMap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ViewStateErrorProps } from '../models/view-state-props.model';
import { ViewStateActionsService } from '../services/view-state-actions.service';

import { ViewStateActions } from './view-state.actions';
import { ViewStateEffects } from './view-state.effects';
import { createViewStateFeature } from './view-state.feature';

describe('ViewStateIntegration', () => {
  let store: Store;
  let actions$: Actions;

  const { viewStatesFeature } = createViewStateFeature<string>()

  const apiService = {
    getData: () => of<string[]>([]),
  };

  const DataActions = createActionGroup({
    source: 'Data',
    events: {
      loadData: emptyProps(),
      loadDataSuccess: props<{ data: string[] }>(),
      loadDataFailure: props<ViewStateErrorProps>(),
    },
  });

  @Injectable()
  class DataEffects {
    public getData$ = this.getData();

    constructor(
      private actions$: Actions,
      private viewStateActionsService: ViewStateActionsService,
    ) {
      this.viewStateActionsService.add([
        {
          startLoadingOn: DataActions.loadData,
          resetLoadingOn: [DataActions.loadDataSuccess],
          error: [DataActions.loadDataFailure],
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
                return of(DataActions.loadDataFailure({}));
              }),
            );
          }),
        );
      });
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        StoreModule.forFeature(viewStatesFeature),
        EffectsModule.forFeature([ViewStateEffects, DataEffects]),
      ],
      providers: [],
    }).compileComponents();

    store = TestBed.inject(Store);
    actions$ = TestBed.inject(Actions);
  });

  it('should handle success data loading correctly', (done) => {
    const dataExpected: Action[] = [
      DataActions.loadData(),
      ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
      DataActions.loadDataSuccess({ data: ['Hello', 'Word'] }),
      ViewStateActions.reset({ actionType: DataActions.loadData.type }),
    ];

    const result: Action[] = [];

    actions$.subscribe((action) => {
      result.push(action);

      if (result.length === dataExpected.length) {
        expect(dataExpected).toEqual(result);
        done();
      }
    });

    spyOn(apiService, 'getData').and.returnValue(of(['Hello', 'Word']));

    store.dispatch(DataActions.loadData());
  });

  it('should handle failure data loading correctly', (done) => {
    const dataExpected: Action[] = [
      DataActions.loadData(),
      ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
      DataActions.loadDataFailure({}),
      ViewStateActions.error({ actionType: DataActions.loadData.type, error: undefined }),
    ];

    const result: Action[] = [];

    actions$.subscribe((action) => {
      result.push(action);

      if (result.length === dataExpected.length) {
        expect(dataExpected).toEqual(result);
        done();
      }
    });

    spyOn(apiService, 'getData').and.returnValue(throwError(() => new Error('Oops')));

    store.dispatch(DataActions.loadData());
  });
});
