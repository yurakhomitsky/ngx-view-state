import { createFeature } from '@ngrx/store';
import { getViewStateReducer } from './view-state.reducer';
import { getViewStateSelectors } from './view-state.selectors';

export function createViewStateFeature<E>() {
  const viewStatesFeatureName = 'viewStates';

  const { initialState, reducer } = getViewStateReducer<E>();

  const viewStatesFeature = createFeature({
    name: viewStatesFeatureName,
    reducer,
    extraSelectors: ({ selectEntities }) => {
      return getViewStateSelectors(selectEntities);
    },
  });

  const {
    selectEntities,
    selectAll,
    selectIds,
    selectActionViewStatus,
    selectIsAnyActionLoading,
    selectIsAnyActionLoaded,
    selectIsAnyActionError,
    selectIsAnyActionIdle,
    selectViewState,
  } = viewStatesFeature;

  return {
    initialState,
    viewStatesFeatureName,
    viewStatesFeature,
    selectViewStateEntities: selectEntities,
    selectViewStateActionTypes: selectIds,
    selectAllViewState: selectAll,
    selectActionViewStatus,
    selectViewState,
    selectIsAnyActionLoading,
    selectIsAnyActionLoaded,
    selectIsAnyActionError,
    selectIsAnyActionIdle,
  };
}
