import { Dictionary } from '@ngrx/entity';
import { Action, createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { uniq } from 'lodash-es';

import { ViewStatusEnum } from '../enums/view-status.enum';
import { idleViewStatus } from '../factories';
import { ViewStatusModel } from '../models/view-status.model';

import { selectEntities, ViewState } from './view-state.feature';

/*
  Can be used to display loading overlay

  @returns A selector that returns `true` if any of the specified actions is loading, otherwise `false`.

  @example
  export const selectAddUpdateDeleteLoading = selectLoadingActions(Actions.add, Actions.update, Actions.delete);
 */
function selectLoadingActions(...actions: Action[]): MemoizedSelector<object, boolean, DefaultProjectorFn<boolean>> {
  const setOfActions = uniq(actions.map((action: Action) => action.type));

  return createSelector(selectEntities, (actionStatuses: Dictionary<ViewState>) => {
    return setOfActions.some((actionType: string): boolean => actionStatuses[actionType]?.viewStatus.type === ViewStatusEnum.LOADING);
  });
}

/*
  Selects status of a single action
  Fall backs to the ViewStatusEnum.IDLE if there is nothing in the state

  @example
  export const selectTodosVM = createSelector(
	selectTodos,
	selectActionStatus(TodosActions.loadTodos),
	(todos, status) => {
		return {
			todos,
			status
		};
	 }
  );

  @returns ViewStatusModel
 */
function selectActionStatus(action: Action): MemoizedSelector<object, ViewStatusModel, DefaultProjectorFn<ViewStatusModel>> {
  return createSelector(selectEntities, (actionsMap: Dictionary<ViewState>) => {
    return actionsMap[action.type]?.viewStatus ?? idleViewStatus();
  });
}

export const ViewStateSelectors = {
  selectLoadingActions,
  selectActionStatus,
};
