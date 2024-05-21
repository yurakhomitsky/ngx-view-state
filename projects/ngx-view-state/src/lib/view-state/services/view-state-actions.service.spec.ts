import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';

import { ViewStateActionsConfig, ViewStateActionsService } from './view-state-actions.service';

describe('ViewStateActionsService', () => {
  let service: ViewStateActionsService;

  const loadData: Action = { type: 'load data' };
  const loadDataSuccess: Action = { type: 'data loaded success' };
  const lodDataFailure: Action = { type: 'data loaded failure' };

  const actionsConfig: ViewStateActionsConfig[] = [
    {
      startLoadingOn: loadData,
      resetLoadingOn: [loadDataSuccess],
      error: [lodDataFailure],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewStateActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  beforeEach(() => {
    service.add(actionsConfig);
  });

  describe('isStartLoadingAction', () => {
    it('should return true for loadData action', () => {
      expect(service.isStartLoadingAction(loadData)).toBe(true);
    });

    it('should return false for loadDataSuccess', () => {
      expect(service.isStartLoadingAction(loadDataSuccess)).toBe(false);
    });

    it('should return false for lodDataFailure', () => {
      expect(service.isStartLoadingAction(lodDataFailure)).toBe(false);
    });
  });

  describe('isResetLoadingAction', () => {
    it('should return true for loadDataSuccess', () => {
      expect(service.isResetLoadingAction(loadDataSuccess)).toBe(true);
    });

    it('should return true for lodDataFailure', () => {
      expect(service.isResetLoadingAction(lodDataFailure)).toBe(false);
    });

    it('should return false for loadData', () => {
      expect(service.isResetLoadingAction(loadData)).toBe(false);
    });
  });

  describe('isErrorAction', () => {
    it('should return true for loadDataFailure', () => {
      expect(service.isErrorAction(lodDataFailure)).toBe(true);
    });

    it('should return false for loadDataSuccess', () => {
      expect(service.isErrorAction(loadDataSuccess)).toBe(false);
    });

    it('should return false for loadData', () => {
      expect(service.isErrorAction(loadData)).toBe(false);
    });
  });

  describe('getResetLoadingId', () => {
    it('should return null', () => {
      expect(service.getActionType({ type: 'some action' })).toBe(null);
    });

    it('should get correct resetLoadingId for loadDataSuccess', () => {
      expect(service.getActionType(loadDataSuccess)).toBe(loadData.type);
    });

    it('should get correct resetLoadingId for lodDataFailure', () => {
      expect(service.getActionType(lodDataFailure)).toBe(loadData.type);
    });
  });
});
