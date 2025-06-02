import { Injectable } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';

import { ViewStateErrorProps } from '../models/view-state-props.model';
import { ViewStateActionsService } from '../services/view-state-actions.service';

import { ViewStateActions } from './view-state.actions';

@Injectable()
export class ViewStateEffects {
  public startLoading$ = this.startLoading();
  public reset$ = this.reset();
  public error$ = this.error();

  constructor(
    private actions$: Actions,
    private viewStateActionsService: ViewStateActionsService
  ) {}

  private startLoading() {
    return createEffect(() => {
      return this.actions$.pipe(
        filter((action: Action) => {
          return (
            this.viewStateActionsService.isViewStateAction(action) &&
            this.viewStateActionsService.isStartLoadingAction(action)
          );
        }),
        map((action: Action) => {
          return ViewStateActions.startLoading({ actionType: action.type });
        })
      );
    });
  }

  private reset() {
    return createEffect(() => {
      return this.actions$.pipe(
        filter((action: Action) => {
          return (
            this.viewStateActionsService.isViewStateAction(action) &&
            this.viewStateActionsService.isResetLoadingAction(action)
          );
        }),
        map((action: Action) => {
          return ViewStateActions.resetMany({ actionTypes: this.viewStateActionsService.getResetActionTypes(action) });
        })
      );
    });
  }

  private error() {
    return createEffect(() => {
      return this.actions$.pipe(
        filter((action: Action) => {
          return (
            this.viewStateActionsService.isViewStateAction(action) && this.viewStateActionsService.isErrorAction(action)
          );
        }),
        map((action: Action) => {
          return ViewStateActions.errorMany({
            actionTypes: this.viewStateActionsService.getErrorActionTypes(action).map((actionType) => {
              return { actionType, error: (action as Action & ViewStateErrorProps)?.viewStateError ?? undefined };
            }),
          });
        })
      );
    });
  }
}
