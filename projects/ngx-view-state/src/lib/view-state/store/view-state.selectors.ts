import { ViewStatusEnum } from '../models/view-status.enum';
import { Action, createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { Dictionary, ViewState } from './view-state.model';
import { idleViewStatus } from '../factories';
import { ViewStatus } from '../models/view-status.model';

export function getViewStateSelectors<E>(selectEntities: MemoizedSelector<object, Dictionary<ViewState<E>>>) {
  const selectIsAnyActionLoading = createSelectorForActionStatus(selectEntities, ViewStatusEnum.LOADING);
  const selectIsAnyActionError = createSelectorForActionStatus(selectEntities, ViewStatusEnum.ERROR);
  const selectIsAnyActionLoaded = createSelectorForActionStatus(selectEntities, ViewStatusEnum.LOADED);
  const selectIsAnyActionIdle = createSelectorForActionStatus(selectEntities, ViewStatusEnum.IDLE);

  function selectViewState(action: Action): MemoizedSelector<object, ViewState<E>, DefaultProjectorFn<ViewState<E>>> {
    const idleViewState: ViewState<E> = { actionType: action.type, viewStatus: idleViewStatus() };

    return createSelector(selectEntities, (actionsMap: Dictionary<ViewState<E>>): ViewState<E> => {
      return actionsMap[action.type] ?? idleViewState;
    });
  }

  function selectActionViewStatus(
    action: Action
  ): MemoizedSelector<object, ViewStatus<E>, DefaultProjectorFn<ViewStatus<E>>> {
    const viewStateSelector = selectViewState(action);

    return createSelector(viewStateSelector, (viewState): ViewStatus<E> => {
      return viewState.viewStatus;
    });
  }

  const selectAll = createSelector(selectEntities, (entities) => Object.values(entities));

  const selectIds = createSelector(selectAll, (entities) => entities.map((entity) => entity.actionType));

  return {
    selectIsAnyActionLoading,
    selectIsAnyActionError,
    selectIsAnyActionLoaded,
    selectIsAnyActionIdle,
    selectActionViewStatus,
    selectViewState,
    selectAll,
    selectIds,
  };
}

function createSelectorForActionStatus<E>(
  selectEntities: MemoizedSelector<object, Dictionary<ViewState<E>>>,
  status: ViewStatusEnum
): (...actions: Action[]) => MemoizedSelector<object, boolean, DefaultProjectorFn<boolean>> {
  return (...actions: Action[]) => {
    return createSelector(selectEntities, (actionStatuses: Dictionary<ViewState<E>>) => {
      return actions.some((action: Action): boolean => actionStatuses[action.type]?.viewStatus.type === status);
    });
  };
}
