import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


export type ActionsMapConfig = { viewState: 'startLoading'  } | { viewState: 'reset', actionType: string } | { viewState: 'error', actionType: string };

export interface ViewStateActionsConfig {
  startLoadingOn: Action;
  resetOn: Action[];
  errorOn: Action[];
}


@Injectable({
  providedIn: 'root',
})
export class ViewStateActionsService {
  public readonly actionsMap = new Map<string, ActionsMapConfig[]>();

  public isViewStateAction(action: Action): boolean {
    return this.actionsMap.has(action.type);
  }

  public getActionConfigs(action: Action): ActionsMapConfig[] {
    return this.actionsMap.get(action.type) ?? [];
  }

  public isStartLoadingAction(action: Action): boolean {
    return this.checkViewState(action, 'startLoading');
  }

  public isResetLoadingAction(action: Action): boolean {
    return this.checkViewState(action, 'reset');
  }

  public isErrorAction(action: Action): boolean {
    return this.checkViewState(action, 'error');
  }

  public getErrorActionTypes(action: Action): string[] {
    const configs = this.getActionConfigs(action);

    return configs.reduce((acc: string[], config: ActionsMapConfig) => {
      if (config.viewState === 'error') {
        acc.push(config.actionType)
      }
      return acc;
    }, []);
  }

  public getResetActionTypes(action: Action): string[] {
    const configs = this.actionsMap.get(action.type) ?? []

    return configs.reduce((acc: string[], config: ActionsMapConfig) => {
      if (config.viewState === 'reset') {
        acc.push(config.actionType)
      }
      return acc;
    }, []);
  }

  public add(actions: ViewStateActionsConfig[]): void {
    actions.forEach((action: ViewStateActionsConfig) => {
      this.addActionToMap(action.startLoadingOn.type, { viewState: 'startLoading' });

      action.resetOn.forEach((resetLoading: Action) => {
        this.addActionToMap(resetLoading.type, { viewState: 'reset', actionType: action.startLoadingOn.type });
      });

      action.errorOn.forEach((errorAction: Action) => {
        this.addActionToMap(errorAction.type, { viewState: 'error', actionType: action.startLoadingOn.type });
      });
    });
  }

  private addActionToMap(actionType: string, actionConfig: ActionsMapConfig): void {
    const existingConfigs = this.actionsMap.get(actionType) || [];
    this.actionsMap.set(actionType, [...existingConfigs, actionConfig]);
  }

  private checkViewState(action: Action, viewState: string): boolean {
    const configs = this.getActionConfigs(action);
    return configs.some(config => config.viewState === viewState);
  }
}
