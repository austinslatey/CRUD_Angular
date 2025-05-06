import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../services/todo.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent {
  @Input() todo: Todo | null = null;
  @Output() submit = new EventEmitter<Todo>();

  localTodo: Todo = { id: 0, title: '', completed: false };

  ngOnChanges() {
    this.localTodo = this.todo
      ? { ...this.todo }
      : { id: 0, title: '', completed: false };
  }

  onSubmit(event: Event) {
    event.preventDefault();
  
    this.localTodo.title = this.localTodo.title.trim();
    if (!this.localTodo.title) {
      console.warn('Todo title is empty — not submitting');
      return;
    }
  
    this.submit.emit({ ...this.localTodo });
  
    // Reset only if it's a new todo (not editing)
    if (this.localTodo.id === 0) {
      this.localTodo = { id: 0, title: '', completed: false };
    }
  }
}