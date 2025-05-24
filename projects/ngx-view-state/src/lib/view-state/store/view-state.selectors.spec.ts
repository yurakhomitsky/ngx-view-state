import { Action } from '@ngrx/store';

import { errorViewStatus, idleViewStatus, loadedViewStatus, loadingViewStatus } from '../factories';

import { createViewStateFeature } from './view-state.feature';
import { Dictionary, ViewState } from './view-state.model';

describe('ViewStateSelectors', () => {
  const { selectIsAnyActionLoading, selectIsAnyActionLoaded, selectIsAnyActionError, selectIsAnyActionIdle, selectActionViewStatus, selectAllViewState, selectViewStateActionTypes, selectViewState } = createViewStateFeature<string>();

  describe('selectActionViewStatus', () => {
    it('should select action status', () => {
      const action: Action = {
        type: 'update',
      };

      const selector = selectActionViewStatus(action);

      expect(selector.projector({
        actionType: action.type,
        viewStatus: loadingViewStatus(),
      },)).toEqual(loadingViewStatus());
    });

    it('should return the same view status reference if the type is the same', () => {
      const action: Action = {
        type: 'update',
      };

      const initialViewStatus: ViewState<string> = {
          actionType: action.type,
          viewStatus: idleViewStatus(),
        };

      const selector = selectActionViewStatus(action);

      const viewStatus = selector.projector(initialViewStatus);

      const viewStatusNewReference = selector.projector(initialViewStatus);

      expect(viewStatusNewReference).toBe(viewStatus);
    });

    it('should return new view status reference if error is different', () => {
      const action: Action = {
        type: 'update',
      };

      const errorState: ViewState<string> = {
        actionType: action.type,
        viewStatus: errorViewStatus('Error message - 1'),
      };

      const selector = selectActionViewStatus(action);

      const errorStatus1 = selector.projector(errorState);

      expect(errorStatus1).toBe(errorState.viewStatus);

      const errorStateNewReference: ViewState<string> = {
        ...errorState,
        viewStatus: errorViewStatus('Error message - 2')
      };

      const errorStatus2 = selector.projector(errorStateNewReference);

      expect(errorStatus2).not.toBe(errorStatus1);
      expect(errorStatus2).toBe(errorStateNewReference.viewStatus);
    });

    it('should return the same view status reference if the error is the same', () => {
      const action: Action = {
        type: 'update',
      };

      const errorState: ViewState<string> = {
        actionType: action.type,
        viewStatus: errorViewStatus('Error message - 77'),
      };

      const selector = selectActionViewStatus(action);

      const errorStatus1 = selector.projector(errorState);

      expect(errorStatus1).toBe(errorState.viewStatus);

      const errorStateNewReference: ViewState<string> = {
        ...errorState,
      }

      const errorStatus2 = selector.projector(errorStateNewReference);

      expect(errorStatus2).toBe(errorStatus1);
    })
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

    it('should return true when at least one of multiple actions is loading', () => {
      const action1: Action = { type: 'action1' };
      const action2: Action = { type: 'action2' };
      const action3: Action = { type: 'action3' };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [action1.type]: {
          actionType: action1.type,
          viewStatus: idleViewStatus(),
        },
        [action2.type]: {
          actionType: action2.type,
          viewStatus: loadingViewStatus(),
        },
        [action3.type]: {
          actionType: action3.type,
          viewStatus: errorViewStatus('Error'),
        },
      };

      const selector = selectIsAnyActionLoading(action1, action2, action3);

      expect(selector.projector(stateDictionary)).toEqual(true);
    });

    it('should return false when none of multiple actions is loading', () => {
      const action1: Action = { type: 'action1' };
      const action2: Action = { type: 'action2' };
      const action3: Action = { type: 'action3' };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [action1.type]: {
          actionType: action1.type,
          viewStatus: idleViewStatus(),
        },
        [action2.type]: {
          actionType: action2.type,
          viewStatus: loadedViewStatus(),
        },
        [action3.type]: {
          actionType: action3.type,
          viewStatus: errorViewStatus('Error'),
        },
      };

      const selector = selectIsAnyActionLoading(action1, action2, action3);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });

    it('should return false when action is not in the state', () => {
      const action: Action = { type: 'non-existent-action' };

      const stateDictionary: Dictionary<ViewState<string>> = {};

      const selector = selectIsAnyActionLoading(action);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });

    it('should return false when no actions are provided', () => {
      const stateDictionary: Dictionary<ViewState<string>> = {
        'some-action': {
          actionType: 'some-action',
          viewStatus: loadingViewStatus(),
        },
      };

      const selector = selectIsAnyActionLoading();

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

    it('should return true when at least one of multiple actions is loaded', () => {
      const action1: Action = { type: 'action1' };
      const action2: Action = { type: 'action2' };
      const action3: Action = { type: 'action3' };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [action1.type]: {
          actionType: action1.type,
          viewStatus: idleViewStatus(),
        },
        [action2.type]: {
          actionType: action2.type,
          viewStatus: loadedViewStatus(),
        },
        [action3.type]: {
          actionType: action3.type,
          viewStatus: errorViewStatus('Error'),
        },
      };

      const selector = selectIsAnyActionLoaded(action1, action2, action3);

      expect(selector.projector(stateDictionary)).toEqual(true);
    });

    it('should return false when none of multiple actions is loaded', () => {
      const action1: Action = { type: 'action1' };
      const action2: Action = { type: 'action2' };
      const action3: Action = { type: 'action3' };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [action1.type]: {
          actionType: action1.type,
          viewStatus: idleViewStatus(),
        },
        [action2.type]: {
          actionType: action2.type,
          viewStatus: loadingViewStatus(),
        },
        [action3.type]: {
          actionType: action3.type,
          viewStatus: errorViewStatus('Error'),
        },
      };

      const selector = selectIsAnyActionLoaded(action1, action2, action3);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });

    it('should return false when action is not in the state', () => {
      const action: Action = { type: 'non-existent-action' };

      const stateDictionary: Dictionary<ViewState<string>> = {};

      const selector = selectIsAnyActionLoaded(action);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });

    it('should return false when no actions are provided', () => {
      const stateDictionary: Dictionary<ViewState<string>> = {
        'some-action': {
          actionType: 'some-action',
          viewStatus: loadedViewStatus(),
        },
      };

      const selector = selectIsAnyActionLoaded();

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

    it('should return true when at least one of multiple actions has error', () => {
      const action1: Action = { type: 'action1' };
      const action2: Action = { type: 'action2' };
      const action3: Action = { type: 'action3' };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [action1.type]: {
          actionType: action1.type,
          viewStatus: idleViewStatus(),
        },
        [action2.type]: {
          actionType: action2.type,
          viewStatus: loadingViewStatus(),
        },
        [action3.type]: {
          actionType: action3.type,
          viewStatus: errorViewStatus('Error message'),
        },
      };

      const selector = selectIsAnyActionError(action1, action2, action3);

      expect(selector.projector(stateDictionary)).toEqual(true);
    });

    it('should return false when none of multiple actions has error', () => {
      const action1: Action = { type: 'action1' };
      const action2: Action = { type: 'action2' };
      const action3: Action = { type: 'action3' };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [action1.type]: {
          actionType: action1.type,
          viewStatus: idleViewStatus(),
        },
        [action2.type]: {
          actionType: action2.type,
          viewStatus: loadingViewStatus(),
        },
        [action3.type]: {
          actionType: action3.type,
          viewStatus: loadedViewStatus(),
        },
      };

      const selector = selectIsAnyActionError(action1, action2, action3);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });

    it('should handle different error messages correctly', () => {
      const action1: Action = { type: 'action1' };
      const action2: Action = { type: 'action2' };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [action1.type]: {
          actionType: action1.type,
          viewStatus: errorViewStatus('Error message 1'),
        },
        [action2.type]: {
          actionType: action2.type,
          viewStatus: errorViewStatus('Error message 2'),
        },
      };

      const selector = selectIsAnyActionError(action1, action2);

      expect(selector.projector(stateDictionary)).toEqual(true);
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

    it('should return true when at least one of multiple actions is idle', () => {
      const action1: Action = { type: 'action1' };
      const action2: Action = { type: 'action2' };
      const action3: Action = { type: 'action3' };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [action1.type]: {
          actionType: action1.type,
          viewStatus: idleViewStatus(),
        },
        [action2.type]: {
          actionType: action2.type,
          viewStatus: loadingViewStatus(),
        },
        [action3.type]: {
          actionType: action3.type,
          viewStatus: errorViewStatus('Error'),
        },
      };

      const selector = selectIsAnyActionIdle(action1, action2, action3);

      expect(selector.projector(stateDictionary)).toEqual(true);
    });

    it('should return false when none of multiple actions is idle', () => {
      const action1: Action = { type: 'action1' };
      const action2: Action = { type: 'action2' };
      const action3: Action = { type: 'action3' };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [action1.type]: {
          actionType: action1.type,
          viewStatus: loadedViewStatus(),
        },
        [action2.type]: {
          actionType: action2.type,
          viewStatus: loadingViewStatus(),
        },
        [action3.type]: {
          actionType: action3.type,
          viewStatus: errorViewStatus('Error'),
        },
      };

      const selector = selectIsAnyActionIdle(action1, action2, action3);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });

    it('should return false when action is not in the state', () => {
      const action: Action = { type: 'non-existent-action' };

      const stateDictionary: Dictionary<ViewState<string>> = {};

      const selector = selectIsAnyActionIdle(action);

      expect(selector.projector(stateDictionary)).toEqual(false);
    });

    it('should return false when no actions are provided', () => {
      const stateDictionary: Dictionary<ViewState<string>> = {
        'some-action': {
          actionType: 'some-action',
          viewStatus: idleViewStatus(),
        },
      };

      const selector = selectIsAnyActionIdle();

      expect(selector.projector(stateDictionary)).toEqual(false);
    });
  })

  describe('selectAll', () => {
    it('should return all actions', () => {
      const getDataAction: Action = {
        type: 'get data',
      };

      const getAdditionalDataAction: Action = {
        type: 'get additional data',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [getDataAction.type]: {
          actionType: getDataAction.type,
          viewStatus: loadingViewStatus(),
        },
        [getAdditionalDataAction.type]: {
          actionType: getAdditionalDataAction.type,
          viewStatus: loadedViewStatus(),
        }
      }


      expect(selectAllViewState.projector(stateDictionary)).toEqual([
        {
          actionType: getDataAction.type,
          viewStatus: loadingViewStatus(),
        },
        {
          actionType: getAdditionalDataAction.type,
          viewStatus: loadedViewStatus(),
        }
      ]);
    })
  })

  describe('selectViewStateActionTypes', () => {
    it('should return all actions', () => {
      const getDataAction: Action = {
        type: 'get data',
      };

      const getAdditionalDataAction: Action = {
        type: 'get additional data',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [getDataAction.type]: {
          actionType: getDataAction.type,
          viewStatus: loadingViewStatus(),
        },
        [getAdditionalDataAction.type]: {
          actionType: getAdditionalDataAction.type,
          viewStatus: loadedViewStatus(),
        }
      }

      expect(selectViewStateActionTypes.projector(Object.values(stateDictionary))).toEqual([
        getDataAction.type,
        getAdditionalDataAction.type
      ]);
    })
  })

  describe('selectViewState', () => {
    it('should return the view state for an action that exists in the state', () => {
      const action: Action = {
        type: 'get data',
      };

      const viewState: ViewState<string> = {
        actionType: action.type,
        viewStatus: loadingViewStatus(),
      };

      const stateDictionary: Dictionary<ViewState<string>> = {
        [action.type]: viewState
      };

      const selector = selectViewState(action);

      expect(selector.projector(stateDictionary)).toEqual(viewState);
    });

    it('should return an idle view state for an action that does not exist in the state', () => {
      const action: Action = {
        type: 'get data',
      };

      const stateDictionary: Dictionary<ViewState<string>> = {};

      const selector = selectViewState(action);
      const result = selector.projector(stateDictionary);

      expect(result).toEqual({
        actionType: action.type,
        viewStatus: idleViewStatus()
      });
    });
  })
});
