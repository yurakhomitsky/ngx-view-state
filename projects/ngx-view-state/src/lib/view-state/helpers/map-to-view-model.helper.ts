import { Observable, UnaryFunction, catchError, map, of, pipe, startWith } from 'rxjs';
import { errorViewStatus, loadingViewStatus } from '../factories';
import { ViewModel } from '../models/view.model';


export function mapToViewModel<T>(): UnaryFunction<Observable<T | null> | never, Observable<ViewModel<T>>> {
  return pipe(
    map(() => {}),
    startWith({ viewStatus: loadingViewStatus() }),
    catchError(() => of({ viewStatus: errorViewStatus() })),
  );
}
