import { Action } from '@ngrx/store';

export interface ViewStateActionsConfig {
  startLoadingOn: Action;
  resetLoadingOn: Action[];
  error: Action[];
}
