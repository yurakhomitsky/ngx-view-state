import { InjectionToken, StaticProvider, Type } from '@angular/core';
import { ErrorStateComponent, LoadingStateComponent } from '../components';
import { ViewStateErrorComponent } from '../models/view-state-component.model';

export const LOADING_STATE_COMPONENT = new InjectionToken<Type<unknown>>('ngx-view-state.loadingComponent', {
  providedIn: 'root',
  factory: () => LoadingStateComponent,
});

export const ERROR_STATE_COMPONENT = new InjectionToken<Type<ViewStateErrorComponent<unknown>>>(
  'ngx-view-state.loadingComponent',
  {
    providedIn: 'root',
    factory: () => ErrorStateComponent,
  }
);

export function provideLoadingStateComponent(component: Type<unknown>): StaticProvider {
  return { provide: LOADING_STATE_COMPONENT, useValue: component };
}

export function provideErrorStateComponent(component: Type<ViewStateErrorComponent<unknown>>): StaticProvider {
  return { provide: ERROR_STATE_COMPONENT, useValue: component };
}
