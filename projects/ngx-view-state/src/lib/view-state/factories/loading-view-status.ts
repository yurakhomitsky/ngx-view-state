import { ViewStatusEnum } from '../models/view-status.enum';
import { ViewLoading } from '../models/view-status.model';

export function loadingViewStatus(): ViewLoading {
  return { type: ViewStatusEnum.LOADING };
}
