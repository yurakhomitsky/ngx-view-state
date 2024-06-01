import { Dictionary } from '@ngrx/entity';
import { Action } from '@ngrx/store';

import { idleViewStatus, loadingViewStatus } from '../factories';

import { createViewStateFeature, ViewState } from './view-state.feature';

describe('ViewStateSelectors', () => {
  const { selectLoadingActions, selectActionStatus } = createViewStateFeature<string>();
  describe('selectActionStatus', () => {
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

      const selector = selectActionStatus(action);

      expect(selector.projector(stateDictionary)).toEqual(loadingViewStatus());
    });

    it('should return null', () => {
      const action: Action = {
        type: 'update',
      };

      const dataStatuses: Dictionary<ViewState<string>> = {};

      const selector = selectActionStatus(action);

      expect(selector.projector(dataStatuses)).toEqual(idleViewStatus());
    });
  });

  describe('selectLoadingActions', () => {
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

      const selector = selectLoadingActions(getDataAction, getAdditionalDataAction);

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

      const selector = selectLoadingActions(getDataAction, getAdditionalDataAction);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });
  });
});
