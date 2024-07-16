import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Todo } from './models/todo.model';
import { CommonModule } from '@angular/common';
import { ViewStateDirective, ViewStateActions } from 'ngx-view-state';
import { Store } from '@ngrx/store';
import { TodosActions } from './store/todos.actions';
import { selectTodos } from './store/todos.feature';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { selectTodosViewStatus, selectActionsLoading } from './store/todos.selectors';
import { LoadingComponent } from './components/loading/loading.component';

@Component({
	selector: 'app-todos',
	standalone: true,
	imports: [CommonModule, ViewStateDirective, MatCardModule, MatTableModule, MatCheckbox, MatFormFieldModule, MatButton, FormsModule, MatInputModule, LoadingComponent],
	templateUrl: './todos.component.html',
	styleUrl: './todos.component.css'
})
export class TodosComponent {
	public displayedColumns: (keyof Todo | 'delete')[] = ['id', 'title', 'completed', 'delete'];
	public todos$ = this.store.select(selectTodos);
	public viewStatus$ = this.store.select(selectTodosViewStatus);
	public isOverlayLoading$ = this.store.select(selectActionsLoading);
	public title = '';

	constructor(private readonly store: Store) {
		this.store.dispatch(TodosActions.loadTodos());
	}

	public addTodo(): void {
		this.store.dispatch(TodosActions.addTodo({ todo: { title: this.title, completed: false, userId: 1 } }));
		this.title = '';
	}

	public onCompleteChange(event: MatCheckboxChange, todo: Todo): void {
		this.store.dispatch(TodosActions.updateTodo({todo: { ...todo, completed: event.checked } }));
	}

	public deleteTodo(todo: Todo): void {
		this.store.dispatch(TodosActions.deleteTodo({ id: todo.id }))
	}

	public setLoading(): void {
		this.store.dispatch(ViewStateActions.startLoading({ actionType: TodosActions.loadTodos.type }));
	}

	public setError(): void {
		this.store.dispatch(ViewStateActions.error({ actionType: TodosActions.loadTodos.type, error: 'Failed to load todos' }));
	}

	public reset(): void {
		this.store.dispatch(ViewStateActions.reset({ actionType: TodosActions.loadTodos.type }));
	}
}
