import { createEntityAdapter, Dictionary } from '@ngrx/entity';
import {
	Action,
	createFeature,
	createReducer,
	createSelector,
	DefaultProjectorFn,
	MemoizedSelector,
	on
} from '@ngrx/store';

import { errorViewStatus, idleViewStatus, loadingViewStatus } from '../factories';
import { BaseViewStatus, ViewStatus } from '../models/view-status.model';

import { ViewStateActions } from './view-state.actions';
import { ViewStatusEnum } from '../models/view-status.enum';

export interface ViewState<E, T extends BaseViewStatus = never> {
	actionType: string;
	viewStatus: ViewStatus<E> | T;
}

export function createViewStateFeature<E, T extends BaseViewStatus = never>() {
	const viewStatesFeatureName = 'viewStates';

	const adapter = createEntityAdapter<ViewState<E, T>>({
		selectId: (viewState) => viewState.actionType
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


			function selectActionViewStatus(action: Action): MemoizedSelector<object, T | ViewStatus<E>, DefaultProjectorFn<T | ViewStatus<E>>> {
				return createSelector(selectEntities, (actionsMap) => {
					return (actionsMap[action.type]?.viewStatus) ?? (idleViewStatus())
				});
			}

			function selectViewState(action: Action): MemoizedSelector<object, ViewState<E, T>, DefaultProjectorFn<ViewState<E, T>>> {
				return createSelector(selectEntities, (actionsMap): ViewState<E, T> => {
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
		selectIsAnyActionIdle,
	};
}

function createSelectorForActionStatus<T extends BaseViewStatus>(
	selectEntities: MemoizedSelector<Record<string, any>, Dictionary<ViewState<any, T>>>,
	status: ViewStatusEnum): (...actions: Action[]) => MemoizedSelector<Record<string, any>, boolean, DefaultProjectorFn<boolean>> {
	return (...actions: Action[]) => {
		return createSelector(selectEntities, (actionStatuses) => {
			return actions.some((action: Action): boolean => actionStatuses[action.type]?.viewStatus.type === status);
		});
	};
}

