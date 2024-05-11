import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';

import { emptyViewStatus, errorViewStatus, loadingViewStatus } from '../factories';
import { ViewStatusModel } from '../models/view-status.model';

import { ViewStateActions } from './view-state.actions';

export const viewStatesFeatureKey = 'viewStates';

export interface ViewState {
  id: string;
  viewStatus: ViewStatusModel;
}

export const adapter: EntityAdapter<ViewState> = createEntityAdapter<ViewState>();

export const initialState = adapter.getInitialState({});

export const reducer = createReducer(
  initialState,
  on(ViewStateActions.startLoading, (state, { id }) => {
    return adapter.upsertOne({ id, viewStatus: loadingViewStatus() }, state);
  }),
  on(ViewStateActions.empty, (state, { id, emptyMessage }) => {
    return adapter.upsertOne({ id, viewStatus: emptyViewStatus(emptyMessage) }, state);
  }),
  on(ViewStateActions.error, (state, { id, errorMessage }) => {
    return adapter.upsertOne({ id, viewStatus: errorViewStatus(errorMessage) }, state);
  }),
  on(ViewStateActions.reset, (state, { id }) => {
    return adapter.removeOne(id, state);
  }),
);

export const viewStatesFeature = createFeature({
  name: viewStatesFeatureKey,
  reducer,
  extraSelectors: ({ selectViewStatesState }) => ({
    ...adapter.getSelectors(selectViewStatesState),
  }),
});

export const { selectEntities } = viewStatesFeature;
