import { ViewStatusEnum } from './models/view-status.enum';
import { ViewLoaded, ViewStatus } from './models/view-status.model';
import { ComponentViewModel } from './models/component-view-model.model';

/**
 * To constrain the generic T type in the directive
 */
export type ViewTypeConstraint<T> = ViewStatus | ComponentViewModel<T>;

/**
 * Type for defining handlers associated with a particular ViewStatusEnum.
 */
export type ViewStatusHandlers<ViewStatuses extends { type: ViewStatusEnum }, T> = {
  [ViewStatus in ViewStatuses as ViewStatus['type']]: (event: { viewStatus: ViewStatus; value: T }) => void;
};

export type ViewContextValue<T> = T extends ViewStatus
  ? ViewLoaded
  : T extends ComponentViewModel<infer U>
    ? { data: U; viewStatus: ViewLoaded }
    : T;
