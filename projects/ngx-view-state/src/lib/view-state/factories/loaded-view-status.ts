import { ViewStatusEnum } from '../models/view-status.enum';
import { ViewLoaded } from '../models/view-status.model';

export function loadedViewStatus(): ViewLoaded {
  return {
    type: ViewStatusEnum.LOADED,
  };
}
