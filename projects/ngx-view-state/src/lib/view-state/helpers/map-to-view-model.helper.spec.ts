import { describe, expect, expectTypeOf, it } from 'vitest';
import { lastValueFrom, of, throwError } from 'rxjs';
import { take, toArray } from 'rxjs/operators';

import { mapToViewModel } from './map-to-view-model.helper';
import { errorViewStatus, loadedViewStatus, loadingViewStatus } from '../factories';

describe('mapToViewModel', () => {
  it('should emit loading state first, then loaded state', async () => {
    const result = await lastValueFrom(of('test').pipe(mapToViewModel(), take(2), toArray()));

    expect(result).toEqual([{ viewStatus: loadingViewStatus() }, { viewStatus: loadedViewStatus(), data: 'test' }]);
  });

  it('should emit loading state first, then error state', async () => {
    const error = new Error('Oops');

    const result = await lastValueFrom(throwError(() => error).pipe(mapToViewModel(), take(2), toArray()));

    expect(result).toEqual([{ viewStatus: loadingViewStatus() }, { viewStatus: errorViewStatus(error) }]);
  });

  it('should map success data using onSuccess callback', async () => {
    const result = await lastValueFrom(
      of('test').pipe(
        mapToViewModel({
          onSuccess: (data) => ({ viewStatus: loadedViewStatus(), data: `${data} hello` }),
        }),
        take(2),
        toArray()
      )
    );

    expect(result).toEqual([
      { viewStatus: loadingViewStatus() },
      { viewStatus: loadedViewStatus(), data: 'test hello' },
    ]);
  });

  it('should correctly transform data to a different type using onSuccess', async () => {
    const result = await lastValueFrom(
      of('test').pipe(
        mapToViewModel({
          onSuccess: () => ({ viewStatus: loadedViewStatus(), data: 123 }),
        }),
        take(2),
        toArray()
      )
    );

    const [, loaded] = result;
    expect(loaded).toEqual({ viewStatus: loadedViewStatus(), data: 123 });
    expectTypeOf(loaded.data).toEqualTypeOf<number | undefined>();
  });

  it('should map error using onError callback', async () => {
    const error = new Error('Oops');

    const result = await lastValueFrom(
      throwError(() => error).pipe(
        mapToViewModel({
          onError: () => ({ viewStatus: errorViewStatus('Mapped error') }),
        }),
        take(2),
        toArray()
      )
    );

    expect(result).toEqual([{ viewStatus: loadingViewStatus() }, { viewStatus: errorViewStatus('Mapped error') }]);
  });

  it('should apply both onSuccess and onError callbacks correctly', async () => {
    const error = new Error('Oops');

    const successResult = await lastValueFrom(
      of('test').pipe(
        mapToViewModel({
          onSuccess: () => ({ viewStatus: loadedViewStatus(), data: 123 }),
          onError: () => ({ viewStatus: errorViewStatus('Mapped error') }),
        }),
        take(2),
        toArray()
      )
    );

    expect(successResult).toEqual([{ viewStatus: loadingViewStatus() }, { viewStatus: loadedViewStatus(), data: 123 }]);

    const errorResult = await lastValueFrom(
      throwError(() => error).pipe(
        mapToViewModel({
          onSuccess: () => ({ viewStatus: loadedViewStatus(), data: 123 }),
          onError: () => ({ viewStatus: errorViewStatus('Mapped error') }),
        }),
        take(2),
        toArray()
      )
    );

    expect(errorResult).toEqual([{ viewStatus: loadingViewStatus() }, { viewStatus: errorViewStatus('Mapped error') }]);
  });
});
