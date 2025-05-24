import { createReducer, on } from '@ngrx/store';
import { errorViewStatus, loadingViewStatus } from '../factories';
import { ViewStateActions } from './view-state.actions';
import { EntityState, ViewState } from './view-state.model';
import { removeMany, removeOne, upsertMany, upsertOne } from './view-state.adapter';

export function getViewStateReducer<E>() {
  const initialState: EntityState<ViewState<E>> = {
    entities: {}
  };

  const reducer = createReducer(
    initialState,
    on(ViewStateActions.startLoading, (state, { actionType }) => {
      return upsertOne({ actionType, viewStatus: loadingViewStatus() }, state);
    }),
    on(ViewStateActions.error, (state, { actionType, error }) => {
      return upsertOne({ actionType, viewStatus: errorViewStatus<E>(error as E) }, state);
    }),
    on(ViewStateActions.errorMany, (state, { actionTypes }) => {
      return upsertMany(actionTypes.map(({ actionType, error }) => {
        return {
          actionType,
          viewStatus: errorViewStatus<E>(error as E)
        };
      }), state);
    }),
    on(ViewStateActions.reset, (state, { actionType }) => {
      return removeOne(actionType, state);
    }),
    on(ViewStateActions.resetMany, (state, { actionTypes }) => {
      return removeMany(actionTypes, state);
    })
  );

  return {
    initialState,
    reducer
  };
}
