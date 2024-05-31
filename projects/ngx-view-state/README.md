# NgxViewState

The `ngx-view-state` library is designed to simplify managing view states of HTTP requests in Angular applications that use NGRX.

This library provides set of utils that allow developers to handle different view states such as loading, error, and loaded states.

## Installation

To install this library, run: `npm install ngx-view-state`


## Usage

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
		{
		  startLoadingOn: TodosActions.updateTodo,
		  resetLoadingOn: [TodosActions.updateTodoSuccess],
		  error: [TodosActions.updateTodoFailure]
		},
		{
		  startLoadingOn: TodosActions.deleteTodo,
		  resetLoadingOn: [TodosActions.deleteTodoSuccess],
		  error: [TodosActions.deleteTodoFailure]
		}
            ]);
    }
}
```
4. create view state selectors

``` typescript
// todos.selectors.ts

import { selectActionStatus, selectLoadingActions } from '../../store/view-state.feature';
import { TodosActions } from './todos.actions';

// Selecto loading/error/idle status of the loadTodos action
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

6. Use the `ViewStateDirective` to display the view state

``` html
<!-- todos.component.html -->
<ng-container *appViewState="viewStatus$ | async">
    <table *ngIf="todos$ | async as todos" mat-table [dataSource]="todos">
        // Render todos
    </table>
</ng-container>
```

7. Override the Loading, Error components

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
