import { of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { errorViewStatus, loadingViewStatus, loadedViewStatus, emptyViewStatus } from '../view-state';

import { mapToViewModel } from './map-to-view-model.helper';

describe('getComponentViewModel', () => {
  it('should start with a loading state', (done) => {
    const source$ = of('test').pipe(mapToViewModel());

    source$.pipe(take(2), toArray()).subscribe((res) => {
      expect(res[0]).toEqual({ viewStatus: loadingViewStatus() });
      expect(res[1]).toEqual({ viewStatus: loadedViewStatus(), data: 'test' });
    });
    done();
  });

  it('should start with a loading state', (done) => {
    const source$ = throwError(() => new Error()).pipe(mapToViewModel());

    source$.pipe(take(2), toArray()).subscribe((res) => {
      expect(res[1]).toEqual({ viewStatus: errorViewStatus() });
    });
    done();
  });

  it('should map to empty array to empty view model', (done) => {
    const source$ = of([]).pipe(mapToViewModel());

    source$.pipe(take(2), toArray()).subscribe((res) => {
      expect(res[1]).toEqual({ viewStatus: emptyViewStatus() });
    });
    done();
  });
});
