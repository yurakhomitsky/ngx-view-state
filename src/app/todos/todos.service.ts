import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTodo, Todo } from './todo.model';

@Injectable({ providedIn: 'root' })
export class TodosService {
	private apiUrl = 'https://jsonplaceholder.typicode.com/todos'; // replace with your API endpoint

	constructor(private http: HttpClient) { }

	public getTodos(): Observable<Todo[]> {
		return this.http.get<Todo[]>(this.apiUrl);
	}

	public addTodo(todo: CreateTodo): Observable<Todo> {
		return this.http.post<Todo>(this.apiUrl, todo);
	}

	public updateTodo(todo: Todo): Observable<Todo> {
		return this.http.put<Todo>(`${this.apiUrl}/${todo.id}`, todo);
	}

	public deleteTodo(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`);
	}
}
