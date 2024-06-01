import { createEntityAdapter, Dictionary, EntityAdapter } from '@ngrx/entity';
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
import { ViewStatus } from '../models/view-status.model';

import { ViewStateActions } from './view-state.actions';
import { ViewStatusEnum } from '../models/view-status.enum';

export interface ViewState<E> {
	actionType: string;
	viewStatus: ViewStatus<E>;
}

export function createViewStateFeature<E>() {
	const viewStatesFeatureKey = 'viewStates';

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
		on(ViewStateActions.reset, (state, { actionType }) => {
			return adapter.removeOne(actionType, state);
		})
	);

	const viewStatesFeature = createFeature({
		name: viewStatesFeatureKey,
		reducer,
		extraSelectors: ({ selectViewStatesState, selectEntities }) => {
			function selectLoadingActions(...actions: Action[]): MemoizedSelector<object, boolean, DefaultProjectorFn<boolean>> {
				return createSelector(selectEntities, (actionStatuses: Dictionary<ViewState<E>>) => {
					return actions.some((action: Action): boolean => actionStatuses[action.type]?.viewStatus.type === ViewStatusEnum.LOADING);
				});
			}

			function selectActionStatus(action: Action): MemoizedSelector<object, ViewStatus<E>, DefaultProjectorFn<ViewStatus<E>>> {
				return createSelector(selectEntities, (actionsMap: Dictionary<ViewState<E>>): ViewStatus<E> => {
					return (actionsMap[action.type]?.viewStatus as ViewStatus<E>) ?? idleViewStatus();
				});
			}

			function selectViewState(action: Action): MemoizedSelector<object, ViewState<E>, DefaultProjectorFn<ViewState<E>>> {
				return createSelector(selectEntities, (actionsMap: Dictionary<ViewState<E>>): ViewState<E> => {
						return actionsMap[action.type] ?? { actionType: action.type, viewStatus: idleViewStatus() };
					}
				);
			}

			return {
				...adapter.getSelectors(selectViewStatesState),
				selectLoadingActions,
				selectActionStatus,
				selectViewState
			};
		}
	});

	const { selectEntities, selectAll, selectIds, selectActionStatus, selectLoadingActions, selectViewState } = viewStatesFeature;

	return {
		initialState,
		viewStatesFeatureKey,
		viewStatesFeature,
		selectViewStateEntities: selectEntities,
		selectViewStateIds: selectIds,
		selectAllViewState: selectAll,
		selectActionStatus,
		selectLoadingActions,
		selectViewState
	};
}
