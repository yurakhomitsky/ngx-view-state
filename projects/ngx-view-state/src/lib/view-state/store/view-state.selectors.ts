// import { Dictionary } from '@ngrx/entity';
// import { Action, createSelector, DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
//
// import { ViewStatusEnum } from '../models/view-status.enum';
// import { idleViewStatus } from '../factories';
// import { ViewStatus } from '../models/view-status.model';
//
// import { selectEntities, ViewState } from './view-state.feature';
//
// /*
//   Can be used to display loading overlay
//
//   @returns A selector that returns `true` if any of the specified actions is loading, otherwise `false`.
//
//   @example
//   export const selectAddUpdateDeleteLoading = selectLoadingActions(Actions.add, Actions.update, Actions.delete);
//  */
// function selectLoadingActions(...actions: Action[]): MemoizedSelector<object, boolean, DefaultProjectorFn<boolean>> {
//   return createSelector(selectEntities, (actionStatuses: Dictionary<ViewState>) => {
//     return actions.some((action: Action): boolean => actionStatuses[action.type]?.viewStatus.type === ViewStatusEnum.LOADING);
//   });
// }
//
// /*
//   Selects status of a single action
//   Fall backs to the ViewStatusEnum.IDLE if there is nothing in the state
//
//   @example
//   export const selectTodosVM = createSelector(
// 	selectTodos,
// 	selectActionStatus(TodosActions.loadTodos),
// 	(todos, status) => {
// 		return {
// 			todos,
// 			status
// 		};
// 	 }
//   );
//
//   @returns ViewStatusModel
//  */
// function selectActionStatus<E = unknown>(action: Action): MemoizedSelector<object, ViewStatus<E>, DefaultProjectorFn<ViewStatus<E>>> {
//   return createSelector(selectEntities, (actionsMap: Dictionary<ViewState>): ViewStatus<E> => {
//     return (actionsMap[action.type]?.viewStatus as ViewStatus<E>) ?? idleViewStatus() ;
//   });
// }
//
// export const ViewStateSelectors = {
//   selectLoadingActions,
//   selectActionStatus,
// };
