import { ViewError, ViewIdle, ViewLoaded, ViewLoading } from '../models/view-status.model';
import { ViewStatusEnum } from '../models/view-status.enum';

export function loadingViewStatus(): ViewLoading {
  return { type: ViewStatusEnum.LOADING };
}

export function idleViewStatus(): ViewIdle {
  return {
    type: ViewStatusEnum.IDLE,
  };
}

export function loadedViewStatus(): ViewLoaded {
  return {
    type: ViewStatusEnum.LOADED,
  };
}

export function errorViewStatus<E>(error?: E): ViewError<E> {
  return {
    type: ViewStatusEnum.ERROR,
    error,
  };
}
