import { ViewLoaded, ViewStatus } from './view-status.model';

export type ComponentViewModel<T, E = unknown> = { data?: T; viewStatus: Exclude<ViewStatus<E>, ViewLoaded> } | { data: T, viewStatus: ViewLoaded };

