import { Observable, catchError, map, of, startWith, UnaryFunction, pipe } from 'rxjs';
import { errorViewStatus, loadedViewStatus, loadingViewStatus } from '../factories';
import { ComponentViewModel } from '../models/component-view-model.model';

export function mapToViewModel<T, E>(): UnaryFunction<Observable<T>, Observable<ComponentViewModel<T, E>>>;
export function mapToViewModel<T, E, R1>(params: {
  onSuccess: (data: T) => ComponentViewModel<R1, E>;
}): UnaryFunction<Observable<T>, Observable<ComponentViewModel<R1, E>>>;
export function mapToViewModel<T, E, R2>(params: {
  onError: (error: E) => ComponentViewModel<T, R2>;
}): UnaryFunction<Observable<T>, Observable<ComponentViewModel<T, R2>>>;
export function mapToViewModel<T, E, R1, R2>(params: {
  onSuccess: (data: T) => ComponentViewModel<R1, E>;
  onError: (error: E) => ComponentViewModel<T, R2>;
}): UnaryFunction<Observable<T>, Observable<ComponentViewModel<R1, R2>>>;
export function mapToViewModel<T, E, R1, R2>(params?: {
  onSuccess?: (data: T) => ComponentViewModel<R1, E>;
  onError?: (error: E) => ComponentViewModel<R1 | R2>;
}) {
  const { onSuccess, onError } = params || {};

  return pipe(
    map((data: T) => {
      return onSuccess ? onSuccess(data) : ({ data, viewStatus: loadedViewStatus() } as ComponentViewModel<T, E>);
    }),
    startWith({ viewStatus: loadingViewStatus() } as ComponentViewModel<undefined, E>),
    catchError((err) => {
      return of(onError ? onError(err) : ({ viewStatus: errorViewStatus(err) } as ComponentViewModel<T, E>));
    })
  );
}
