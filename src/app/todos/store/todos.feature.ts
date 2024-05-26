import { Todo } from '../models/todo.model';
import { createFeature, createReducer, on } from '@ngrx/store';
import { TodosActions } from './todos.actions';

interface State {
	todos: Todo[]
}

export const initialState: State = {
	todos: []
}

const reducer = createReducer(initialState,
	on(TodosActions.loadTodosSuccess, (state, { todos }) => ({ ...state, todos })),
	on(TodosActions.addTodoSuccess, (state, { todo }) => ({ ...state, todos: [...state.todos, todo] })),
	on(TodosActions.updateTodoSuccess, (state, { todo }) => ({ ...state, todos: state.todos.map(t => t.id === todo.id ? todo : t) })),
	on(TodosActions.deleteTodoSuccess, (state, { id }) => ({ ...state, todos: state.todos.filter(t => t.id !== id) }),
));

export const todosFeature = createFeature({
	name: 'todos',
	reducer,
});

export const { selectTodos } = todosFeature
