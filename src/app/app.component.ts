import { Component } from '@angular/core';
import { TodosComponent } from './todos/todos.component';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  imports: [TodosComponent, MatToolbar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
