import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';

import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { viewStatesFeature } from './store/view-state.feature';
import { ViewStateEffects, provideLoadingStateComponent, provideErrorStateComponent } from 'ngx-view-state';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { todosFeature } from './todos/store/todos.feature';
import { TodosEffects } from './todos/store/todos.effects';
import { LoadingComponent } from './todos/components/loading/loading.component';
import { ErrorComponent } from './todos/components/error/error.component';

export const routes: Routes = [];

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(),
		provideStore({}),
		provideState(viewStatesFeature),
		provideState(todosFeature),
		provideEffects(ViewStateEffects, TodosEffects),
		provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }), provideAnimationsAsync(),
		provideLoadingStateComponent(LoadingComponent),
		provideErrorStateComponent(ErrorComponent)
	]
};
