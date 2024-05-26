import { createActionGroup, props } from '@ngrx/store';

export const ViewStateActions = createActionGroup({
  source: 'ViewState',
  events: {
    startLoading: props<{ actionType: string }>(),
    reset: props<{ actionType: string }>(),
    error: props<{ actionType: string; error?: unknown }>(),
  },
});
