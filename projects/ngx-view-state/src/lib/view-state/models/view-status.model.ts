import { ViewStatusEnum } from './view-status.enum';

export interface BaseViewStatus {
  readonly type: string;
}

export interface ViewIdle {
  readonly type: ViewStatusEnum.IDLE;
}

export interface ViewLoading {
  readonly type: ViewStatusEnum.LOADING;
}

export interface ViewLoaded {
  readonly type: ViewStatusEnum.LOADED;
}

export interface ViewError<E = unknown> {
  readonly type: ViewStatusEnum.ERROR;
  readonly error?: E;
}

export type ViewStatus<E = unknown> = ViewIdle | ViewLoading | ViewLoaded | ViewError<E>;
