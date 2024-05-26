import { ViewStatusEnum } from '../models/view-status.enum';
import { ViewError } from '../models/view-status.model';

export function errorViewStatus<E>(error?: E): ViewError<E> {
  return {
    type: ViewStatusEnum.ERROR,
    error,
  };
}
