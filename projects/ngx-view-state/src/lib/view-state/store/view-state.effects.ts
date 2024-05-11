import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { ViewStateErrorProps, ViewStateSuccessProps } from '../models/view-state-props';
import { ViewStateActionsService } from '../services/view-state-actions.service';

import { ViewStateActions } from './view-state.actions';

@Injectable()
export class ViewStateEffects {
  public startLoading$ = this.startLoading();
  public reset$ = this.reset();
  public error$ = this.error();

  constructor(
    private actions$: Actions,
    private viewStateActionsService: ViewStateActionsService,
  ) {}

  private startLoading() {
    return createEffect(() => {
      return this.actions$.pipe(
        filter((action: Action) => {
          return this.viewStateActionsService.isStartLoadingAction(action);
        }),
        map((action: Action) => {
          return ViewStateActions.startLoading({ id: action.type });
        }),
      );
    });
  }

  private reset() {
    return createEffect(() => {
      return this.actions$.pipe(
        filter((action: Action) => {
          return this.viewStateActionsService.isResetLoadingAction(action);
        }),
        map((action: Action & ViewStateSuccessProps) => {
          const id = this.viewStateActionsService.getResetLoadingId(action) ?? '';
          return action.isDataEmpty ? ViewStateActions.empty({ id, emptyMessage: action.emptyText }) : ViewStateActions.reset({ id });
        }),
      );
    });
  }

  private error() {
    return createEffect(() => {
      return this.actions$.pipe(
        filter((action: Action) => {
          return this.viewStateActionsService.isErrorAction(action);
        }),
        map((action: Action & ViewStateErrorProps) => {
          return ViewStateActions.error({
            id: this.viewStateActionsService.getResetLoadingId(action) ?? '',
            errorMessage: action.errorMessage,
          });
        }),
      );
    });
  }
}
