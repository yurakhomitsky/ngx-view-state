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

/**
 * Compares two ViewStatus objects for equality
 * Returns true if both statuses have the same type and, in case of ERROR type, the same error
 */
export function areViewStatusesEqual(a: ViewStatus, b: ViewStatus): boolean {
  if (a.type !== b.type) return false;
  if (a.type === ViewStatusEnum.ERROR && b.type === ViewStatusEnum.ERROR) {
    return a.error === b.error;
  }
  return true;
}
