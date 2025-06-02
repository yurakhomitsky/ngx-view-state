import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosComponent } from './todos.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { selectTodos } from './store/todos.feature';
import { selectActionsLoading, selectTodosViewStatus } from './store/todos.selectors';
import { idleViewStatus } from 'ngx-view-state';

describe('TodosComponent', () => {
  let component: TodosComponent;
  let fixture: ComponentFixture<TodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosComponent],
      providers: [
        provideExperimentalZonelessChangeDetection(),
        provideMockStore({
          selectors: [
            {
              selector: selectTodos,
              value: [],
            },
            {
              selector: selectTodosViewStatus,
              value: idleViewStatus(),
            },
            {
              selector: selectActionsLoading,
              value: false,
            },
          ],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TodosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
