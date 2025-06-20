import { ViewStatus } from '../models/view-status.model';

export type Dictionary<T> = Record<string, T>;

export interface EntityState<T> {
  entities: Dictionary<T>;
}

export interface ViewState<E> {
  actionType: string;
  viewStatus: ViewStatus<E>;
}
