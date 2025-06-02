import { ViewError, ViewIdle, ViewLoaded, ViewLoading, ViewStatus } from '../models/view-status.model';

import {
  isViewStatusLoading,
  isViewStatusError,
  isViewStatusIdle,
  isViewStatusLoaded,
  areViewStatusesEqual,
} from './view-status.helper';
import { errorViewStatus, idleViewStatus, loadedViewStatus, loadingViewStatus } from '../factories';

describe('ViewStatusHelpers', () => {
  let viewStatusLoading: ViewLoading;
  let viewStatusError: ViewError;
  let viewStatusLoaded: ViewLoaded;
  let viewStatusIdle: ViewIdle;

  beforeEach(() => {
    viewStatusLoading = loadingViewStatus();
    viewStatusError = errorViewStatus();
    viewStatusLoaded = loadedViewStatus();
    viewStatusIdle = idleViewStatus();
  });

  describe('isViewStatusLoading', () => {
    it('should return true when viewStatus is loading', () => {
      expect(isViewStatusLoading(viewStatusLoading)).toBe(true);
    });

    it('should return false when viewStatus is not loading', () => {
      expect(isViewStatusLoading(viewStatusError)).toBe(false);
    });
  });

  describe('isViewStatusError', () => {
    it('should return true when viewStatus is error', () => {
      expect(isViewStatusError(viewStatusError)).toBe(true);
    });

    it('should return false when viewStatus is not error', () => {
      expect(isViewStatusError(viewStatusLoading)).toBe(false);
    });
  });

  describe('isViewStatusLoaded', () => {
    it('should return true when viewStatus is loaded', () => {
      expect(isViewStatusLoaded(viewStatusLoaded)).toBe(true);
    });

    it('should return false when viewStatus is not loaded', () => {
      expect(isViewStatusLoaded(viewStatusLoading)).toBe(false);
    });
  });

  describe('isViewStatusIdle', () => {
    it('should return true when viewStatus is idle', () => {
      expect(isViewStatusIdle(viewStatusIdle)).toBe(true);
    });

    it('should return false when viewStatus is not idle', () => {
      expect(isViewStatusIdle(viewStatusLoading)).toBe(false);
    });
  });

  describe('areViewStatusesEqual', () => {
    it('should return false if types are different', () => {
      const status1: ViewStatus = loadingViewStatus();
      const status2: ViewStatus = idleViewStatus();

      const result = areViewStatusesEqual(status1, status2);

      expect(result).toBe(false);
    });

    it('should return true if types are the same and not ERROR', () => {
      const status1: ViewStatus = loadingViewStatus();
      const status2: ViewStatus = loadingViewStatus();

      const result = areViewStatusesEqual(status1, status2);

      expect(result).toBe(true);
    });

    it('should return true if ERROR types with same error', () => {
      const status1: ViewStatus<string> = errorViewStatus('Same error');
      const status2: ViewStatus<string> = errorViewStatus('Same error');

      const result = areViewStatusesEqual(status1, status2);

      expect(result).toBe(true);
    });

    it('should return false if ERROR types with different errors', () => {
      const status1: ViewStatus<string> = errorViewStatus('Error 1');
      const status2: ViewStatus<string> = errorViewStatus('Error 2');

      const result = areViewStatusesEqual(status1, status2);

      expect(result).toBe(false);
    });
  });
});
