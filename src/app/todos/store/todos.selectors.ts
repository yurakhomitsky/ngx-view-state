import { selectActionViewStatus, selectIsAnyActionLoading } from '../../store/view-state.feature';
import { TodosActions } from './todos.actions';

export const selectTodosViewStatus = selectActionViewStatus(TodosActions.loadTodos);
export const selectActionsLoading = selectIsAnyActionLoading(TodosActions.addTodo, TodosActions.updateTodo, TodosActions.deleteTodo);
