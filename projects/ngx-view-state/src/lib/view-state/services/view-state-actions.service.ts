import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


export type ActionsMapConfig = { viewState: 'startLoading'  } | { viewState: 'resetLoading', actionType: string } | { viewState: 'error', actionType: string };

export interface ViewStateActionsConfig {
  startLoadingOn: Action;
  resetLoadingOn: Action[];
  error: Action[];
}


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

  public getActionType(action: Action): string | null {
    const actionConfig = this.actionsMap.get(action.type);
    if (!actionConfig) {
      return null;
    }

    if (actionConfig.viewState === 'startLoading') {
      return null;
    }

    return actionConfig.actionType
  }

  public add(actions: ViewStateActionsConfig[]): void {
    actions.forEach((action: ViewStateActionsConfig) => {
      this.actionsMap.set(action.startLoadingOn.type, { viewState: 'startLoading' });

      action.resetLoadingOn.forEach((resetLoading: Action) => {
        this.actionsMap.set(resetLoading.type, { viewState: 'resetLoading', actionType: action.startLoadingOn.type });
      });

      action.error.forEach((errorAction: Action) => {
        this.actionsMap.set(errorAction.type, { viewState: 'error', actionType: action.startLoadingOn.type });
      });
    });
  }
}
