import { createEntityAdapter, Dictionary, EntityAdapter } from '@ngrx/entity';
import {
	Action,
	createFeature,
	createReducer,
	createSelector,
	createSelectorFactory,
	DefaultProjectorFn,
	MemoizedSelector,
	on,
	resultMemoize
} from '@ngrx/store';

import { errorViewStatus, idleViewStatus, loadingViewStatus } from '../factories';
import { ViewStatus } from '../models/view-status.model';

import { ViewStateActions } from './view-state.actions';
import { ViewStatusEnum } from '../models/view-status.enum';

export interface ViewState<E> {
	actionType: string;
	viewStatus: ViewStatus<E>;
}

export function createViewStateFeature<E>() {
	const viewStatesFeatureName = 'viewStates';

	const adapter: EntityAdapter<ViewState<E>> = createEntityAdapter<ViewState<E>>({
		selectId: (viewState: ViewState<E>) => viewState.actionType
	});

	const initialState = adapter.getInitialState({});

	const reducer = createReducer(
		initialState,
		on(ViewStateActions.startLoading, (state, { actionType }) => {
			return adapter.upsertOne({ actionType, viewStatus: loadingViewStatus() }, state);
		}),
		on(ViewStateActions.error, (state, { actionType, error }) => {
			return adapter.upsertOne({ actionType, viewStatus: errorViewStatus<E>(error as E) }, state);
		}),
		on(ViewStateActions.errorMany, (state, { actionTypes }) => {
			return adapter.upsertMany(actionTypes.map(({ actionType, error }) => {
				return {
					actionType,
					viewStatus: errorViewStatus<E>(error as E)
				};
			}), state);
		}),
		on(ViewStateActions.reset, (state, { actionType }) => {
			return adapter.removeOne(actionType, state);
		}),
		on(ViewStateActions.resetMany, (state, { actionTypes }) => {
			return adapter.removeMany(actionTypes, state);
		})
	);

	const viewStatesFeature = createFeature({
		name: viewStatesFeatureName,
		reducer,
		extraSelectors: ({ selectViewStatesState, selectEntities }) => {
			const selectIsAnyActionLoading = createSelectorForActionStatus(selectEntities, ViewStatusEnum.LOADING);
			const selectIsAnyActionError = createSelectorForActionStatus(selectEntities, ViewStatusEnum.ERROR);
			const selectIsAnyActionLoaded = createSelectorForActionStatus(selectEntities, ViewStatusEnum.LOADED);
			const selectIsAnyActionIdle = createSelectorForActionStatus(selectEntities, ViewStatusEnum.IDLE);


			function selectActionViewStatus(action: Action): MemoizedSelector<object, ViewStatus<E>, DefaultProjectorFn<ViewStatus<E>>> {
				const customViewStateSelectorMemo = createSelectorFactory<object, ViewStatus<E>>((projector) => {
					return resultMemoize(projector, (a: ViewStatus, b: ViewStatus): boolean => {
						return a.type === b.type;
					});
				});

				return customViewStateSelectorMemo(selectEntities, (actionsMap: Dictionary<ViewState<E>>): ViewStatus<E> => {
					return (actionsMap[action.type]?.viewStatus as ViewStatus<E>) ?? idleViewStatus();
				});
			}

			function selectViewState(action: Action): MemoizedSelector<object, ViewState<E>, DefaultProjectorFn<ViewState<E>>> {
				const customViewStateSelectorMemo = createSelectorFactory<object, ViewState<E>>((projector) => {
					return resultMemoize(projector, (a: ViewState<E>, b: ViewState<E>): boolean => {
						return a.viewStatus.type === b.viewStatus.type;
					});
				});

				return customViewStateSelectorMemo(selectEntities, (actionsMap: Dictionary<ViewState<E>>): ViewState<E> => {
						return actionsMap[action.type] ?? { actionType: action.type, viewStatus: idleViewStatus() };
					}
				);
			}

			return {
				...adapter.getSelectors(selectViewStatesState),
				selectIsAnyActionLoading,
				selectIsAnyActionError,
				selectIsAnyActionLoaded,
				selectIsAnyActionIdle,
				selectActionViewStatus,
				selectViewState
			};
		}
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
		selectViewState
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
		selectIsAnyActionIdle
	};
}

function createSelectorForActionStatus<E>(
	selectEntities: MemoizedSelector<Record<string, any>, Dictionary<ViewState<E>>>,
	status: ViewStatusEnum): (...actions: Action[]) => MemoizedSelector<Record<string, any>, boolean, DefaultProjectorFn<boolean>> {
	return (...actions: Action[]) => {
		return createSelector(selectEntities, (actionStatuses: Dictionary<ViewState<E>>) => {
			return actions.some((action: Action): boolean => actionStatuses[action.type]?.viewStatus.type === status);
		});
	};
}

