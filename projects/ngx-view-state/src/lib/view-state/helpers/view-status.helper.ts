import { ViewStatusEnum } from '../enums/view-status.enum';
import { ViewError, ViewIdle, ViewLoaded, ViewLoading, ViewStatusModel } from '../models/view-status.model';

export function isViewStatusLoading(viewStatus: ViewStatusModel): viewStatus is ViewLoading {
  return viewStatus.type === ViewStatusEnum.LOADING;
}

export function isViewStatusError(viewStatus: ViewStatusModel): viewStatus is ViewError {
  return viewStatus.type === ViewStatusEnum.ERROR;
}

export function isViewStatusLoaded(viewStatus: ViewStatusModel): viewStatus is ViewLoaded {
  return viewStatus.type === ViewStatusEnum.LOADED;
}

export function isViewStatusIdle(viewStatus: ViewStatusModel): viewStatus is ViewIdle {
  return viewStatus.type === ViewStatusEnum.IDLE;
}
