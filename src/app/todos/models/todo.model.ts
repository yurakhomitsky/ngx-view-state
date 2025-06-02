export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export type CreateTodo = Pick<Todo, 'title' | 'completed' | 'userId'>;
