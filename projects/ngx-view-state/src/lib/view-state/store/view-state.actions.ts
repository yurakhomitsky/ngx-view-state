import { createActionGroup, props } from '@ngrx/store';

export const ViewStateActions = createActionGroup({
  source: 'ViewState',
  events: {
    startLoading: props<{ id: string }>(),
    reset: props<{ id: string }>(),
    empty: props<{ id: string; emptyMessage?: string }>(),
    error: props<{ id: string; errorMessage?: string }>(),
  },
});
