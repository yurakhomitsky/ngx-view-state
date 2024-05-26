import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';

import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { viewStatesFeature } from './store/view-state.feature';
import { ViewStateEffects } from '../../projects/ngx-view-state/src/lib/view-state';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const routes: Routes = [];


export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(),
		provideStore({}),
		provideState(viewStatesFeature),
		provideEffects(ViewStateEffects),
		provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }), provideAnimationsAsync()
	]
};
