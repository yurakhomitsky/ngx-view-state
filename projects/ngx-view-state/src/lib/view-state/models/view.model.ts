import { ViewStatusModel } from './view-status.model';

export interface ViewModel<T> {
  viewStatus: ViewStatusModel;
  data?: T;
}
