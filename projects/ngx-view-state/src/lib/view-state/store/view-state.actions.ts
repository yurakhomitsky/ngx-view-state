import { createActionGroup, props } from '@ngrx/store';

export const ViewStateActions = createActionGroup({
	source: 'ViewState',
	events: {
		startLoading: props<{ actionType: string }>(),
		reset: props<{ actionType: string }>(),
		resetMany: props<{ actionTypes: string[] }>(),
		error: props<{ actionType: string; error?: unknown }>(),
		errorMany: props<{ actionTypes: { actionType: string, error?: unknown }[] }>()
	}
});
