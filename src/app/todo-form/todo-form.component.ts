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
  @Input() todo: Todo = { id: 0, title: '', completed: false };
  @Output() submit = new EventEmitter<Todo>();

  onSubmit(event: Event) {
    event.preventDefault(); // Prevent native form submission
    console.log('Form submitted:', this.todo); // Debug log
    if (this.todo.title.trim()) { // Ensure non-empty title
      this.submit.emit({ ...this.todo });
      this.todo = { id: 0, title: '', completed: false }; // Reset form
    }
  }
}