import { ViewStatusEnum } from './enums/view-status.enum';
import { ViewModel } from './models/view.model';
import { ViewLoaded, ViewStatusModel } from './models/view-status.model';

/**
 * To constrain the generic T type in the directive
 */
export type ViewTypeConstraint<T> = ViewStatusModel | ViewModel<T>;

/**
 * Type for defining handlers associated with a particular ViewStatusEnum.
 */
export type ViewStatusHandlers<ViewStatuses extends { type: ViewStatusEnum }, T> = {
  [ViewStatus in ViewStatuses as ViewStatus['type']]: (event: { viewStatus: ViewStatus; value: T }) => void;
};

export type ViewContextValue<T> = T extends ViewStatusModel ? ViewLoaded : T;
