import { ViewStatus } from '../models/view-status.model';

export interface Dictionary<T> {
  [id: string]: T;
}

export interface EntityState<T> {
  entities: Dictionary<T>;
}

export interface ViewState<E> {
  actionType: string;
  viewStatus: ViewStatus<E>;
}
