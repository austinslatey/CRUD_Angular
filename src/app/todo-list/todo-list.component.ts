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
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  todoToEdit: Todo | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.getTodos().subscribe((todos) => {
      this.todos = todos;
      console.log('Todos updated:', this.todos); // Debug log
    });
  }

  addTodo(todo: Todo) {
    console.log('Adding todo:', todo); // Debug log
    // Guard against invalid todo objects
    if (!todo || typeof todo.title !== 'string' || !todo.title.trim()) {
      console.error('Invalid todo object:', todo);
      return;
    }
    if (this.todoToEdit) {
      this.todoService.updateTodo(todo).subscribe(() => {
        this.todoToEdit = null;
      });
    } else {
      const newTodo = { ...todo, id: this.todos.length + 1 };
      this.todoService.addTodo(newTodo).subscribe((addedTodo) => {
        // Ensure no duplicates in local todos array
        if (!this.todos.some((t) => t.id === addedTodo.id)) {
          this.todos = [...this.todos, addedTodo]; // Update immutably
        }
      });
    }
  }

  editTodo(todo: Todo) {
    this.todoToEdit = { ...todo };
  }

  updateTodo(todo: Todo) {
    this.todoService.updateTodo(todo).subscribe();
  }

  deleteTodo(id: number) {
    this.todoService.deleteTodo(id).subscribe(() => {
      this.todos = this.todos.filter((todo) => todo.id !== id);
    });
  }

  trackById(index: number, todo: Todo): number {
    return todo.id;
  }
}