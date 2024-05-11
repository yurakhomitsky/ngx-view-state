import { ViewStatusEnum } from '../enums/view-status.enum';
import { ViewError } from '../models/view-status.model';

export function errorViewStatus(errorMessage?: string): ViewError {
  return {
    type: ViewStatusEnum.ERROR,
    errorMessage,
  };
}
