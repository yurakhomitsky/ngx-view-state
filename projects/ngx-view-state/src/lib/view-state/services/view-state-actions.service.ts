import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { ActionsMapConfig, ViewStateActionsConfig } from './models';

@Injectable({
  providedIn: 'root',
})
export class ViewStateActionsService {
  private actionsMap = new Map<string, ActionsMapConfig>();

  public isStartLoadingAction(action: Action): boolean {
    return this.actionsMap.get(action.type)?.viewState === 'startLoading';
  }

  public isResetLoadingAction(action: Action): boolean {
    return this.actionsMap.get(action.type)?.viewState === 'resetLoading';
  }

  public isErrorAction(action: Action): boolean {
    return this.actionsMap.get(action.type)?.viewState === 'error';
  }

  public getResetLoadingId(action: Action): string | null {
    return this.actionsMap.get(action.type)?.resetLoadingId ?? null;
  }

  public add(actions: ViewStateActionsConfig[]): void {
    actions.forEach((action: ViewStateActionsConfig) => {
      this.actionsMap.set(action.startLoadingOn.type, { viewState: 'startLoading' });

      action.resetLoadingOn.forEach((resetLoading: Action) => {
        this.actionsMap.set(resetLoading.type, { viewState: 'resetLoading', resetLoadingId: action.startLoadingOn.type });
      });

      action.error.forEach((errorAction: Action) => {
        this.actionsMap.set(errorAction.type, { viewState: 'error', resetLoadingId: action.startLoadingOn.type });
      });
    });
  }
}
