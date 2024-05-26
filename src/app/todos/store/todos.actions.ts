import { createAction, props } from '@ngrx/store';
import { CreateTodo, Todo } from '../models/todo.model';
import { ViewStateErrorProps } from 'ngx-view-state';

export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction('[Todo] Load Todos Success', props<{ todos: Todo[] }>());
export const loadTodosFailure = createAction('[Todo] Load Todos Failure', props<ViewStateErrorProps<string>>());

export const addTodo = createAction('[Todo] Add Todo', props<{ todo: CreateTodo }>());
export const addTodoSuccess = createAction('[Todo] Add Todo Success', props<{ todo: Todo }>());
export const addTodoFailure = createAction('[Todo] Add Todo Failure', props<ViewStateErrorProps<string>>());

export const updateTodo = createAction('[Todo] Update Todo', props<{ todo: Todo }>());
export const updateTodoSuccess = createAction('[Todo] Update Todo Success', props<{ todo: Todo }>());
export const updateTodoFailure = createAction('[Todo] Update Todo Failure', props<ViewStateErrorProps<string>>());

export const deleteTodo = createAction('[Todo] Delete Todo', props<{ id: number }>());
export const deleteTodoSuccess = createAction('[Todo] Delete Todo Success', props<{ id: number }>());
export const deleteTodoFailure = createAction('[Todo] Delete Todo Failure', props<ViewStateErrorProps<string>>());

export const TodosActions = {
	loadTodos,
	loadTodosSuccess,
	loadTodosFailure,
	addTodo,
	addTodoSuccess,
	addTodoFailure,
	updateTodo,
	updateTodoSuccess,
	updateTodoFailure,
	deleteTodo,
	deleteTodoSuccess,
	deleteTodoFailure,
}
