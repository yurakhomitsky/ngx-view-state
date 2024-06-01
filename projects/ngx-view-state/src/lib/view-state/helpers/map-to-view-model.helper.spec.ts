import { of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { mapToViewModel } from './map-to-view-model.helper';
import { errorViewStatus, loadedViewStatus, loadingViewStatus } from '../factories';

describe('getComponentViewModel', () => {
  it('should map to loaded view status', (done) => {
    const source$ = of('test').pipe(mapToViewModel());

    source$.pipe(take(2), toArray()).subscribe((res) => {
      expect(res).toEqual([
        { viewStatus: loadingViewStatus() },
        { viewStatus: loadedViewStatus(), data: 'test' }
      ])
      done();
    });
  });

  it('should map to error view status', (done) => {
    const error = new Error('Oops');
    const source$ = throwError(() => error).pipe(mapToViewModel());

    source$.pipe(take(2), toArray()).subscribe((res) => {
      expect(res).toEqual([
        { viewStatus: loadingViewStatus() },
        { viewStatus: errorViewStatus(error) }
      ]);
    });
    done();
  });

  it('should map based on provided map function', (done) => {
    const source$ = of('test').pipe(mapToViewModel({
      onSuccess: (data) => ({ viewStatus: loadedViewStatus(), data: data + ' hello' })
    }));

    source$.pipe(take(2), toArray()).subscribe((res) => {
      expect(res).toEqual([
        { viewStatus: loadingViewStatus() },
        { viewStatus: loadedViewStatus(), data: 'test hello' }
      ])
      done();
    });
  })

  it('should map based on provided map function with error', (done) => {
    const error = new Error('Oops');

    const source$ = throwError(() => error).pipe(mapToViewModel({
      onError: (error) => ({ viewStatus: errorViewStatus('Mapped error') })
    }));

    source$.pipe(take(2), toArray()).subscribe((res) => {
      expect(res).toEqual([
        { viewStatus: loadingViewStatus() },
        { viewStatus: errorViewStatus('Mapped error') }
      ]);
    });
    done();
  })
});
