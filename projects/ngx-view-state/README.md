<h1 style="text-align: center;">NgxViewState</h1>

The `ngx-view-state` library is designed to simplify managing view states(Loading, Success, Error) of HTTP requests in Angular applications that use NGRX.

This library provides set of utils that allow developers to handle different view states such as loading, error, and loaded states.

## Overview

* [Installation](#installation)
* [Usage with Ngrx](#usage-with-ngrx)
* [Usage ngxViewState directive](#usage-ngxviewstate-directive)
* [Components customization](#components-customization)
* [Usage with HttpClient](#usage-with-httpclient)
* [Documentation](#documentation)

### [Stackblitz Example](https://stackblitz.com/edit/ngx-view-state)

### [Medium blog post](https://medium.com/@yura.khomitsky8/a-single-state-for-loading-success-error-in-ngrx-e50c5d782478)


## Installation

Run: `npm install ngx-view-state`


## Usage With Ngrx

1. Create view state feature and pass generic type for the error state
    
``` typescript
// view-state.feature.ts
import { createViewStateFeature } from 'ngx-view-state';

export const { 
    viewStatesFeature, 
    selectActionViewStatus, 
    selectIsAnyActionLoading 
} = createViewStateFeature<string>()
```
2. Provide the `viewStateFeature` and `ViewStateEffect` in the root

``` typescript
// app.config.ts

import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { viewStatesFeature } from './store/view-state.feature';
import { ViewStateEffects } from 'ngx-view-state';

export const appConfig: ApplicationConfig = {
	providers: [
		provideStore({}),
		provideState(viewStatesFeature),
		provideEffects(ViewStateEffects),
	]
};
```
3. Register actions in your effect to mark them as view state actions

``` typescript
// todos.effects.ts

import { ViewStateActionsService } from 'ngx-view-state';

@Injectable()
export class TodosEffects {

constructor(private actions$: Actions, private viewStateActionsService: ViewStateActionsService) {
	this.viewStateActionsService.add([
		{
		  startLoadingOn: TodosActions.loadTodos,
		  resetOn: [TodosActions.loadTodosSuccess],
		  errorOn: [TodosActions.loadTodosFailure]
		},
		{
		  startLoadingOn: TodosActions.addTodo,
		  resetOn: [TodosActions.addTodoSuccess],
		  errorOn: [TodosActions.addTodoFailure]
		},
		// Update and delete actions can be added in the same way
            ]);
    }
}
```
4. Create view state selectors

``` typescript
// todos.selectors.ts

import { selectActionViewStatus, selectIsAnyActionLoading } from '../../store/view-state.feature';
import { TodosActions } from './todos.actions';

// Select loading/error/idle status of the loadTodos action
export const selectTodosViewStatus = selectActionViewStatus(TodosActions.loadTodos);

// To display an overlay when any of the actions are loading
export const selectIsTodosActionLoading = selectIsAnyActionLoading(TodosActions.addTodo, TodosActions.updateTodo, TodosActions.deleteTodo);

```

5. Make use of previously created selectors and dispatch the load action.
    
``` typescript
// todos.component.ts

import { selectTodos } from './store/todos.feature';
import { selectTodosViewStatus, selectIsTodosActionLoading } from './store/todos.selectors';
import { ViewStateDirective } from 'ngx-view-state';

@Component({
	selector: 'app-todos',
	standalone: true,
	imports: [ViewStateDirective],
	templateUrl: './todos.component.html',
	styleUrl: './todos.component.css'
})
export class TodosComponent {
	public todos$ = this.store.select(selectTodos);
	
	public viewState$ = this.store.select(selectTodosViewStatus);
	public isOverlayLoading$ = this.store.select(selectIsTodosActionLoading);

	constructor(private store: Store) {
		this.store.dispatch(TodosActions.loadTodos());
	}
```


## Usage ngxViewState directive

Import the `ViewStateDirective` in your component and pass the view state value to the directive.

``` html
<!-- todos.component.html -->
<ng-container *ngxViewState="viewState$ | async">
    <table *ngIf="todos$ | async as todos" mat-table [dataSource]="todos">
        // Render todos
    </table>
  <div class="loading-shade" *ngIf="isOverlayLoading$ | async">
	<app-loading></app-loading>
   </div>
</ng-container>
```

Directive will then render the appropriate component based on the view state value.


## Components customization

You can provide your own components by using the `provideLoadingStateComponent` and `provideErrorStateComponent` functions.

By default, the library uses the `ngx-view-state` components with simple template

``` typescript
// app.config.ts

import { provideLoadingStateComponent, provideErrorStateComponent } from 'ngx-view-state';

export const appConfig: ApplicationConfig = {
	providers: [
            // ...
            provideLoadingStateComponent(LoadingComponent),
            provideErrorStateComponent(ErrorComponent)
	]
};
```

## Usage with HttpClient

`mapToViewModel` is a utility function that can be used to map the response of an HTTP request to a `ComponentViewModel` interface that is compatible with  the `ngxViewState` directive.

``` typescript

import { mapToViewModel } from 'ngx-view-state';

@Injectable()
export class TodosService {
    constructor(private http: HttpClient) {}

    loadTodos(): Observable<ComponentViewModel<Todo[]>> {
        return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').pipe(
            mapToViewModel()
        );
    }
}
```

And then in your component, you can use the `ngxViewState` directive to handle the view state of the HTTP request.

``` typescript
// todos.component.ts

import { TodosService } from './todos.service';

@Component({
    selector: 'app-todos',
    standalone: true,
    imports: [ViewStateDirective],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.css'
})
export class TodosComponent {
    public todos$ = this.todosService.loadTodos();

    constructor(private todosService: TodosService) {}
}
```

``` html
<!-- todos.component.html -->
<ng-container *ngxViewState="todos$ as todos">
    <table mat-table [dataSource]="todos.data">
        // Render todos
    </table>
</ng-container>
```
You can also perform custom mapping by passing an object with `onSuccess` and `onError` handlers to the `mapToViewModel` function.

``` typescript
import { mapToViewModel } from 'ngx-view-state';


loadTodos(): Observable<ComponentViewModel<Todo[]>> {
        return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').pipe(
            mapToViewModel({
                onSuccess: (data) => ({ viewStatus: loadedViewStatus(), data: data.map(...) }),
                onError: (error) => ({ viewStatus: errorViewStatus('Failed to load todos') })
            }
        );
    }
```

## Documentation

* [createViewStateFeature](#createviewstatefeature)
* [Selectors](#selectors)
* [ViewStateActions](#viewstateactions)
* [ViewStateEffects](#viewstateeffects)
* [ViewStatus](#viewstatus)
* [ViewStateDirective](#viewstatedirective)
* [provideLoadingStateComponent](#provideloadingstatecomponent)
* [provideErrorStateComponent](#provideerrorstatecomponent)
* [ViewStateErrorProps](#viewstateerrorprops)
* [ComponentViewModel](#componentviewmodel)
* [mapToViewModel](#maptoviewmodel)

### `createViewStateFeature`

Creates a feature that holds the view state of the actions.

State interface:
``` typescript
export interface ViewState<E> {
	actionType: string;
	viewStatus: ViewStatus<E>;
}
```

Where `E` generic is the type of the error state.

- `actionType` is the static type property of the action.
- `viewStatus` is the view state of the action.

Returns an object with the following properties:
- `initialState` - Initial state of the view state feature.
- `viewStatesFeatureName` - Name of the view state feature.
- `viewStatesFeature` - Ngrx feature that holds the view state of the actions.

### Selectors:
- `selectViewStateEntities` - returns the view state entities.
- `selectViewStateActionTypes` - returns the view state action types (`TodosActions.loadTodos.type`).
- `selectAllViewState` - returns all view states.
- `selectActionViewStatus` - returns the view status of the action.
- `selectViewState` - returns the view state entity by action type.
- `selectIsAnyActionLoading` - returns whether any of the provided actions are in `LOADING` state.
- `selectIsAnyActionLoaded` - returns whether any of the provided actions are in `LOADED` state.
- `selectIsAnyActionError` - returns whether any of the provided actions are in `ERROR` state.
- `selectIsAnyActionIdle` - returns whether any of the provided actions are in `IDLE` state.


### `ViewStateActions`

Action group to work with the view state reducer

``` typescript
export const ViewStateActions = createActionGroup({
	source: 'ViewState',
	events: {
		startLoading: props<{ actionType: string }>(),
		reset: props<{ actionType: string }>(),
		resetMany: props<{ actionTypes: string[] }>(),
		error: props<{ actionType: string; error?: unknown }>(),
		errorMany: props<{ actionTypes: { actionType: string, error?: unknown }[] }>()
	}
});
```

### `ViewStateEffects`

An effect that listens to the actions and updates the view state of the action.

List of effects:

- `startLoading$` - upsert the view state of the action to `LOADING`.
- `reset$` - resets many view state actions to `IDLE`.
- `error$` - upsert many view state actions to `ERROR`.

`reset$` and `error$` effects reset or error multiple view states because one action can be used in many configuration and change the view state of multiple actions.

### `ViewStatus` 
A union type that represents the view state:

``` typescript
export interface ViewIdle {
  readonly type: ViewStatusEnum.IDLE;
}

export interface ViewLoading {
  readonly type: ViewStatusEnum.LOADING;
}

export interface ViewLoaded {
  readonly type: ViewStatusEnum.LOADED;
}

export interface ViewError<E = unknown> {
  readonly type: ViewStatusEnum.ERROR;
  readonly error?: E;
}


export type ViewStatus<E = unknown> = ViewIdle 
| ViewLoading 
| ViewLoaded 
| ViewError<E>;

```

factory functions:
- `idleViewStatus` - returns the idle view status.
- `loadingViewStatus` - returns the loading view status.
- `loadedViewStatus` - returns the loaded view status.
- `errorViewStatus` - returns the error view status with an optional error payload.


### `ViewStateDirective`

A structural directive that handles the view state of the component. 

is compatible with the `ComponentViewModel` and `ViewStatus` interfaces.

Handles view status in the following way:

``` typescript
private viewStatusHandlers: ViewStatusHandlers<ViewStatus, T> = {
    [ViewStatusEnum.IDLE]: () => {
      this.createContent();
    },
    [ViewStatusEnum.LOADING]: () => {
      this.createSpinner();
    },
    [ViewStatusEnum.LOADED]: () => {
      this.createContent();
    },
    [ViewStatusEnum.ERROR]: ({ viewStatus }) => {
      this.createErrorState(viewStatus.error);
    },
  };
```
When using the `AsyncPipe`, the directive will render the spinner for the first time

``` typescript
    if (value == null) {
      this.viewContainerRef.clear();
      this.createSpinner();
      return;
    }
```

### `provideLoadingStateComponent`

A utility functions that provides a custom loading component for the `ViewStateDirective` directive.

``` typescript
import { provideLoadingStateComponent } from 'ngx-view-state';

export const appConfig: ApplicationConfig = {
    providers: [
            // ...
            provideLoadingStateComponent(LoadingComponent),
    ]
};
```

### `provideErrorStateComponent`

A utility functions that provides a custom error component for the `ViewStateDirective` directive.

``` typescript
import { provideErrorStateComponent } from 'ngx-view-state';

export const appConfig: ApplicationConfig = {
    providers: [
            // ...
            provideErrorStateComponent(ErrorComponent)
    ]
};
```

### `ViewStateErrorProps`

An interface to implement the error state component.

``` typescript

@Component({
  selector: 'ngx-error-state',
  standalone: true,
  imports: [],
  template: `
    <h2>{{ viewStateError || 'There is an error displaying this data' }}</h2>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorStateComponent implements ViewStateErrorComponent<string> {
  @Input() public viewStateError?: string;
}
```

### `ComponentViewModel`

A generic interface that represents the view model of the component. Is used to handle the view state of the HTTP request along with `mapToViewModel` rxjs operator function.

``` typescript
import { ViewLoaded, ViewStatus } from './view-status.model';

export type ComponentViewModel<T, E = unknown> = 
{ data?: T; viewStatus: Exclude<ViewStatus<E>, ViewLoaded> } 
| { data: T, viewStatus: ViewLoaded };
```

### `mapToViewModel`
A utility function that maps the response of an HTTP request to a `ComponentViewModel` interface.
Accepts an object with `onSuccess` and `onError` handlers.

``` typescript
import { mapToViewModel } from 'ngx-view-state';

@Injectable()
export class TodosService {
    constructor(private http: HttpClient) {}

    loadTodos(): Observable<ComponentViewModel<Todo[]>> {
        return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos').pipe(
            mapToViewModel()
        );
    }
}
```

