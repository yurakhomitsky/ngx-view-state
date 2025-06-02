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

  constructor(
    private actions$: Actions,
    private todosService: TodosService,
    private viewStateActionsService: ViewStateActionsService
  ) {
    this.viewStateActionsService.add([
      {
        startLoadingOn: TodosActions.loadTodos,
        resetOn: [TodosActions.loadTodosSuccess],
        errorOn: [TodosActions.loadTodosFailure],
      },
      {
        startLoadingOn: TodosActions.addTodo,
        resetOn: [TodosActions.addTodoSuccess],
        errorOn: [TodosActions.addTodoFailure],
      },
      {
        startLoadingOn: TodosActions.updateTodo,
        resetOn: [TodosActions.updateTodoSuccess],
        errorOn: [TodosActions.updateTodoFailure],
      },
      {
        startLoadingOn: TodosActions.deleteTodo,
        resetOn: [TodosActions.deleteTodoSuccess],
        errorOn: [TodosActions.deleteTodoFailure],
      },
    ]);
  }

  private getTodos() {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(TodosActions.loadTodos),
        switchMap(() =>
          this.todosService.getTodos().pipe(
            map((todos) => TodosActions.loadTodosSuccess({ todos })),
            catchError(() => of(TodosActions.loadTodosFailure({ viewStateError: 'Could not load todos' })))
          )
        )
      )
    );
  }

  private addTodo() {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(TodosActions.addTodo),
        concatMap(({ todo }) =>
          this.todosService.addTodo(todo).pipe(
            map((todo) => {
              return TodosActions.addTodoSuccess({ todo });
            }),
            catchError(() => {
              return of(TodosActions.addTodoFailure({ viewStateError: 'Could not add todo' }));
            })
          )
        )
      )
    );
  }

  private updateTodo() {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(TodosActions.updateTodo),
        concatMap(({ todo }) =>
          this.todosService.updateTodo(todo).pipe(
            map((todo) => {
              return TodosActions.updateTodoSuccess({ todo });
            }),
            catchError(() => {
              return of(TodosActions.updateTodoFailure({ viewStateError: 'Could not update todo' }));
            })
          )
        )
      )
    );
  }

  private deleteTodo() {
    return createEffect(() =>
      this.actions$.pipe(
        ofType(TodosActions.deleteTodo),
        concatMap(({ id }) =>
          this.todosService.deleteTodo(id).pipe(
            map(() => {
              return TodosActions.deleteTodoSuccess({ id });
            }),
            catchError(() => {
              return of(TodosActions.deleteTodoFailure({ viewStateError: 'Could not delete todo' }));
            })
          )
        )
      )
    );
  }
}
