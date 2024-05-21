import { Observable, UnaryFunction, catchError, map, of, pipe, startWith } from 'rxjs';
import { errorViewStatus, loadedViewStatus, loadingViewStatus } from '../factories';
import { ComponentViewModel } from '../models/component-view-model.model';


type ViewModelMapping<T, E> = {
  onSuccess?: (data: T) => ComponentViewModel<T, E>;
  onError?: (error: E) => ComponentViewModel<T, E>;
}

export function mapToViewModel<T, E>(params?: ViewModelMapping<T, E>): UnaryFunction<Observable<T>, Observable<ComponentViewModel<T, E>>> {
  const { onSuccess, onError } = params || {};

  return pipe(
    map((data: T) => {
     return onSuccess ? onSuccess(data) : { data, viewStatus: loadedViewStatus(),  };
    }),
    startWith({ viewStatus: loadingViewStatus() }),
    catchError((err) => {
      return of(onError ? onError(err) : { viewStatus: errorViewStatus(err) });
    }),
  );
}
