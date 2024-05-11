import { ViewStatusEnum } from '../enums/view-status.enum';
import { ViewEmpty } from '../models/view-status.model';

export function emptyViewStatus(emptyTextTitle?: string): ViewEmpty {
  return {
    type: ViewStatusEnum.EMPTY,
    emptyTextTitle,
  };
}
