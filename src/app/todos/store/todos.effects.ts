import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TodosService } from '../todos.service';
import { ViewStateActionsService } from 'ngx-view-state';
import { TodosActions } from './todos.actions';
import { catchError, concatMap, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TodosEffects {
	public getTodos$ = this.getTodos();
	public addTodo$ = this.addTodo();
	public updateTodo$ = this.updateTodo();
	public deleteTodo$ = this.deleteTodo();

	constructor(private actions$: Actions, private todosService: TodosService, private viewStateActionsService: ViewStateActionsService) {
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
			},
		])
	}

	private getTodos() {
		return createEffect(() => this.actions$.pipe(
			ofType(TodosActions.loadTodos),
			switchMap(() => this.todosService.getTodos().pipe(
				map(todos => TodosActions.loadTodosSuccess({ todos })),
				catchError(error => of(TodosActions.loadTodosFailure({ error })))
			)
		)));
	}
	private addTodo() {
		return createEffect(() => this.actions$.pipe(
			ofType(TodosActions.addTodo),
			concatMap(({ todo }) => this.todosService.addTodo(todo).pipe(
				map(todo => {
					return TodosActions.addTodoSuccess({ todo });
				}),
				catchError(error => {
					return of(TodosActions.addTodoFailure({ error }));
				})
			)
		)));
	}

	private updateTodo() {
		return createEffect(() => this.actions$.pipe(
			ofType(TodosActions.updateTodo),
			concatMap(({ todo }) => this.todosService.updateTodo(todo).pipe(
				map(todo => {
					return TodosActions.updateTodoSuccess({ todo });
				}),
				catchError(error => {
					return of(TodosActions.updateTodoFailure({ error }));
				})
			)
		)));
	}

	private deleteTodo() {
		return createEffect(() => this.actions$.pipe(
			ofType(TodosActions.deleteTodo),
			concatMap(({ id }) => this.todosService.deleteTodo(id).pipe(
				map(() => {
					return TodosActions.deleteTodoSuccess({ id });
				}),
				catchError(error => {
					return of(TodosActions.deleteTodoFailure({ error }));
				})
			)
		)));
	}
}
