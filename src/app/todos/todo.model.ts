export interface Todo {
	id: number,
	title: string,
	body: string,
	userId: number;
}

export type CreateTodo = Pick<Todo, 'title' | 'body' | 'userId'>;
