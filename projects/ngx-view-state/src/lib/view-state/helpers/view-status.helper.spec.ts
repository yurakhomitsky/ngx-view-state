
import { ViewError, ViewIdle, ViewLoaded, ViewLoading } from '../models/view-status.model';

import { isViewStatusLoading, isViewStatusError, isViewStatusIdle, isViewStatusLoaded } from './view-status.helper';
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
});
