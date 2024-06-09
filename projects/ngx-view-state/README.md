<h1 style="text-align: center;">NgxViewState</h1>

The `ngx-view-state` library is designed to simplify managing view states of HTTP requests in Angular applications that use NGRX.

This library provides set of utils that allow developers to handle different view states such as loading, error, and loaded states.

## Overview

* [Installation](#installation)
* [Usage with Ngrx](#usage-with-ngrx)
* [Usage ngxViewState directive](#usage-ngxviewstate-directive)
* [Components customization](#components-customization)
* [Usage with HttpClient](#usage-with-httpclient)

#### Stackblitz Example
[https://stackblitz.com/edit/ngx-view-state](https://stackblitz.com/edit/ngx-view-state)

## Installation

Run: `npm install ngx-view-state`


## Usage With Ngrx

1. Create view state feature and pass generic type for the error state
    
``` typescript
// view-state.feature.ts
import { createViewStateFeature } from 'ngx-view-state';

export const { viewStatesFeature, selectActionStatus, selectLoadingActions } = createViewStateFeature<string>()
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
		provideState(todosFeature),
		provideEffects(ViewStateEffects, TodosEffects),
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
		  resetLoadingOn: [TodosActions.loadTodosSuccess],
		  error: [TodosActions.loadTodosFailure]
		},
		{
		  startLoadingOn: TodosActions.addTodo,
		  resetLoadingOn: [TodosActions.addTodoSuccess],
		  error: [TodosActions.addTodoFailure]
		},
		// Update and delete actions can be added in the same way
            ]);
    }
}
```
4. Create view state selectors

``` typescript
// todos.selectors.ts

import { selectActionStatus, selectLoadingActions } from '../../store/view-state.feature';
import { TodosActions } from './todos.actions';

// Select loading/error/idle status of the loadTodos action
export const selectTodosViewState = selectActionStatus(TodosActions.loadTodos);

// To display an overlay when any of the actions are loading
export const selectActionsLoading = selectLoadingActions(TodosActions.addTodo, TodosActions.updateTodo, TodosActions.deleteTodo);

```

5. Make use of previously created selectors and dispatch the load action.
    
``` typescript
// todos.component.ts

import { selectTodos } from './store/todos.feature';
import { selectTodosViewState, selectActionsLoading } from './store/todos.selectors';
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
	
	public viewState$ = this.store.select(selectTodosViewState);
	public isOverlayLoading$ = this.store.select(selectActionsLoading);

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

The view state can be one of the following values:


``` typescript
ViewStatus | ComponentViewModel<T>;
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


