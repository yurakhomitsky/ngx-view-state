import { Dictionary } from '@ngrx/entity';
import { Action } from '@ngrx/store';

import { errorViewStatus, idleViewStatus, loadedViewStatus, loadingViewStatus } from '../factories';

import { createViewStateFeature, ViewState } from './view-state.feature';

describe('ViewStateSelectors', () => {
  const { selectIsAnyActionLoading, selectIsAnyActionLoaded, selectIsAnyActionError, selectIsAnyActionIdle, selectActionViewStatus } = createViewStateFeature<string>();

  describe('selectActionViewStatus', () => {
    it('should select action status', () => {
      const action: Action = {
        type: 'update',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [action.type]: {
          actionType: action.type,
          viewStatus: loadingViewStatus(),
        },
      };

      const selector = selectActionViewStatus(action);

      expect(selector.projector(stateDictionary)).toEqual(loadingViewStatus());
    });

    it('should return null', () => {
      const action: Action = {
        type: 'update',
      };

      const dataStatuses: Dictionary<ViewState<string>> = {};

      const selector = selectActionViewStatus(action);

      expect(selector.projector(dataStatuses)).toEqual(idleViewStatus());
    });
  });

  describe('selectIsAnyActionsLoading', () => {
    it('should return true', () => {
      const getDataAction: Action = {
        type: 'get data',
      };

      const getAdditionalDataAction: Action = {
        type: 'get additional data',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [getAdditionalDataAction.type]: {
          actionType: getAdditionalDataAction.type,
          viewStatus: loadingViewStatus(),
        },
      };

      const selector = selectIsAnyActionLoading(getDataAction, getAdditionalDataAction);

      expect(selector.projector(stateDictionary)).toEqual(true);
    });

    it('should return false', () => {
      const getDataAction: Action = {
        type: 'get data',
      };

      const getAdditionalDataAction: Action = {
        type: 'get additional data',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {};

      const selector = selectIsAnyActionLoading(getDataAction, getAdditionalDataAction);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });
  });

  describe('selectIsAnyActionsLoaded', () => {
    it('should return true', () => {
      const getDataAction: Action = {
        type: 'get data',
      };

      const getAdditionalDataAction: Action = {
        type: 'get additional data',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [getAdditionalDataAction.type]: {
          actionType: getAdditionalDataAction.type,
          viewStatus: loadedViewStatus(),
        },
      };

      const selector = selectIsAnyActionLoaded(getDataAction, getAdditionalDataAction);

      expect(selector.projector(stateDictionary)).toEqual(true);
    });

    it('should return false', () => {
      const getDataAction: Action = {
        type: 'get data',
      };

      const getAdditionalDataAction: Action = {
        type: 'get additional data',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {};

      const selector = selectIsAnyActionLoaded(getDataAction, getAdditionalDataAction);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });
  })

  describe('selectIsAnyActionsError', () => {
    it('should return true', () => {
      const getDataAction: Action = {
        type: 'get data',
      };

      const getAdditionalDataAction: Action = {
        type: 'get additional data',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [getAdditionalDataAction.type]: {
          actionType: getAdditionalDataAction.type,
          viewStatus: errorViewStatus('Oops!'),
        },
      };

      const selector = selectIsAnyActionError(getDataAction, getAdditionalDataAction);

      expect(selector.projector(stateDictionary)).toEqual(true);
    });

    it('should return false', () => {
      const getDataAction: Action = {
        type: 'get data',
      };

      const getAdditionalDataAction: Action = {
        type: 'get additional data',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {};

      const selector = selectIsAnyActionError(getDataAction, getAdditionalDataAction);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });
  })

  describe('selectIsAnyActionsIdle', () => {
    it('should return true', () => {
      const getDataAction: Action = {
        type: 'get data',
      };

      const getAdditionalDataAction: Action = {
        type: 'get additional data',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [getAdditionalDataAction.type]:  {
          actionType: getAdditionalDataAction.type,
          viewStatus: idleViewStatus(),
        }
      };

      const selector = selectIsAnyActionIdle(getDataAction, getAdditionalDataAction);

      expect(selector.projector(stateDictionary)).toEqual(true);
    });

    it('should return false', () => {
      const getDataAction: Action = {
        type: 'get data',
      };

      const getAdditionalDataAction: Action = {
        type: 'get additional data',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {};

      const selector = selectIsAnyActionIdle(getDataAction, getAdditionalDataAction);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });
  })
});
