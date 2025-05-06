import { Component, OnInit } from '@angular/core';
import { TodoService, Todo } from '../services/todo.service';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoFormComponent],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  todoToEdit: Todo | null = null;

  constructor(private todoService: TodoService) { }

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        console.log('Todos loaded:', this.todos);
      },
      error: (err) => console.error('Error loading todos:', err)
    });
  }

  onFormSubmit(todo: Todo) {
    if (!todo || !todo.title?.trim()) {
      console.warn('Form submit attempted with invalid todo:', todo);
      return;
    }

    const trimmedTitle = todo.title.trim();

    if (todo.id) {
      // Update
      this.todoService.updateTodo({ ...todo, title: trimmedTitle }).subscribe({
        next: () => {
          this.todoToEdit = null;
          this.loadTodos();
        }
      });
    } else {
      // Add new
      const newId = this.todos.length > 0
        ? Math.max(...this.todos.map(t => t.id)) + 1
        : 1;

      const newTodo: Todo = {
        id: newId,
        title: trimmedTitle,
        completed: false
      };

      this.todoService.addTodo(newTodo).subscribe({
        next: () => {
          this.todoToEdit = null;
          this.loadTodos();
        }
      });
    }
  }


  editTodo(todo: Todo) {
    console.log('Editing todo:', todo);
    this.todoToEdit = { ...todo };
  }

  updateTodo(todo: Todo) {
    console.log('Updating todo (checkbox):', todo);
    this.todoService.updateTodo(todo).subscribe({
      next: () => this.loadTodos(),
      error: (err) => console.error('Error updating todo:', err)
    });
  }

  deleteTodo(todo: Todo) {
    this.todoService.deleteTodo(todo.id).subscribe(() => {
      this.todoToEdit = null;
      this.loadTodos();
    });
  }

  trackById(index: number, todo: Todo): number {
    return todo.id;
  }
}