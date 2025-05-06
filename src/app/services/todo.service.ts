import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todos: Todo[] = [
    { id: 1, title: 'Learn Angular', completed: false },
    { id: 2, title: 'Build CRUD App', completed: true },
  ];

  getTodos(): Observable<Todo[]> {
    console.log('Returning todos:', this.todos); // Debug log
    return of(this.todos);
  }

  addTodo(todo: Todo): Observable<Todo> {
    console.log('Service adding todo:', todo); // Debug log
    if (!todo.title.trim()) {
      console.warn('Attempted to add todo with empty title:', todo);
    }
    // Prevent duplicates by checking id or title
    if (!this.todos.some((t) => t.id === todo.id || t.title === todo.title)) {
      this.todos = [...this.todos, todo]; // Update immutably
    }
    return of(todo);
  }

  updateTodo(updatedTodo: Todo): Observable<Todo> {
    const index = this.todos.findIndex((todo) => todo.id === updatedTodo.id);
    if (index !== -1) {
      this.todos = [
        ...this.todos.slice(0, index),
        updatedTodo,
        ...this.todos.slice(index + 1),
      ];
    }
    return of(updatedTodo);
  }

  deleteTodo(id: number): Observable<void> {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    return of(undefined);
  }
}