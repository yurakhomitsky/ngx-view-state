import { ViewStatusEnum } from '../models/view-status.enum';
import { ViewError, ViewIdle, ViewLoaded, ViewLoading, ViewStatus } from '../models/view-status.model';

export function isViewStatusLoading(viewStatus: ViewStatus): viewStatus is ViewLoading {
  return viewStatus.type === ViewStatusEnum.LOADING;
}

export function isViewStatusError(viewStatus: ViewStatus): viewStatus is ViewError {
  return viewStatus.type === ViewStatusEnum.ERROR;
}

export function isViewStatusLoaded(viewStatus: ViewStatus): viewStatus is ViewLoaded {
  return viewStatus.type === ViewStatusEnum.LOADED;
}

export function isViewStatusIdle(viewStatus: ViewStatus): viewStatus is ViewIdle {
  return viewStatus.type === ViewStatusEnum.IDLE;
}
