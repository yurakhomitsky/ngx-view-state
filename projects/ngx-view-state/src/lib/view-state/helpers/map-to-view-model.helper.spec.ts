import { describe, expect, it } from 'vitest';
import { of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { mapToViewModel } from './map-to-view-model.helper';
import { errorViewStatus, loadedViewStatus, loadingViewStatus } from '../factories';

describe('getComponentViewModel', () => {
  it('should map to loaded view status', async () => {
    const source$ = of('test').pipe(mapToViewModel());

    source$.pipe(take(2), toArray()).subscribe((res) => {
      expect(res).toEqual([{ viewStatus: loadingViewStatus() }, { viewStatus: loadedViewStatus(), data: 'test' }]);
    });
  });

  it('should map to error view status', async () => {
    const error = new Error('Oops');
    const source$ = throwError(() => error).pipe(mapToViewModel());

    source$.pipe(take(2), toArray()).subscribe((res) => {
      expect(res).toEqual([{ viewStatus: loadingViewStatus() }, { viewStatus: errorViewStatus(error) }]);
    });
  });

  it('should map based on provided map function', async () => {
    const source$ = of('test').pipe(
      mapToViewModel({
        onSuccess: (data) => ({ viewStatus: loadedViewStatus(), data: data + ' hello' }),
      })
    );

    source$.pipe(take(2), toArray()).subscribe((res) => {
      expect(res).toEqual([
        { viewStatus: loadingViewStatus() },
        { viewStatus: loadedViewStatus(), data: 'test hello' },
      ]);
    });
  });

  it('should map based on provided map function with error', async () => {
    const error = new Error('Oops');

    const source$ = throwError(() => error).pipe(
      mapToViewModel({
        onError: () => ({ viewStatus: errorViewStatus('Mapped error') }),
      })
    );

    source$.pipe(take(2), toArray()).subscribe((res) => {
      expect(res).toEqual([{ viewStatus: loadingViewStatus() }, { viewStatus: errorViewStatus('Mapped error') }]);
    });
  });
});
