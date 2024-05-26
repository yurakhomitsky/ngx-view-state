import { selectActionStatus, selectLoadingActions } from '../../store/view-state.feature';
import { TodosActions } from './todos.actions';

export const selectTodosViewState = selectActionStatus(TodosActions.loadTodos);
export const selectActionsLoading = selectLoadingActions(TodosActions.addTodo, TodosActions.updateTodo, TodosActions.deleteTodo);
