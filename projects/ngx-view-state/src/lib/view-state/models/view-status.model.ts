import { ViewStatusEnum } from '../enums/view-status.enum';

export interface ViewIdle {
  readonly type: ViewStatusEnum.IDLE;
}

export interface ViewLoading {
  readonly type: ViewStatusEnum.LOADING;
}

export interface ViewLoaded {
  readonly type: ViewStatusEnum.LOADED;
}

export interface ViewEmpty {
  readonly type: ViewStatusEnum.EMPTY;

  readonly emptyTextTitle?: string;
}

export interface ViewError {
  readonly type: ViewStatusEnum.ERROR;

  readonly errorMessage?: string;
}

export type ViewStatusModel = ViewIdle | ViewLoading | ViewLoaded | ViewEmpty | ViewError;
