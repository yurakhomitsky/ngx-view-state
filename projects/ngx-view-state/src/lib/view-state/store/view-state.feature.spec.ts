import { errorViewStatus, loadingViewStatus } from '../factories';

import { ViewStateActions } from './view-state.actions';
import { createViewStateFeature } from './view-state.feature';
import { ViewError } from '../models/view-status.model';

describe('ViewStateFeature', () => {
  const { viewStatesFeature, initialState } = createViewStateFeature<string | { message: string }>();
  it('should add loading action if its not in the state', () => {
    const state = viewStatesFeature.reducer(
      initialState,
      ViewStateActions.startLoading({
        actionType: '123',
      })
    );

    expect(state).toEqual({
      entities: {
        '123': {
          actionType: '123',
          viewStatus: loadingViewStatus(),
        },
      },
    });
  });

  it('should remove action from the state', () => {
    const state = viewStatesFeature.reducer(
      {
        entities: {
          '123': {
            actionType: '123',
            viewStatus: loadingViewStatus(),
          },
        },
      },
      ViewStateActions.reset({
        actionType: '123',
      })
    );

    expect(state).toEqual({
      entities: {},
    });
  });

  it('should add error action to the state', () => {
    const state = viewStatesFeature.reducer(
      {
        entities: {},
      },
      ViewStateActions.error({
        actionType: '123',
        error: 'Custom error message',
      })
    );

    expect(state).toEqual({
      entities: {
        '123': {
          actionType: '123',
          viewStatus: errorViewStatus('Custom error message'),
        },
      },
    });
  });

  it('should error many actions to the state', () => {
    const state = viewStatesFeature.reducer(
      {
        entities: {},
      },
      ViewStateActions.errorMany({
        actionTypes: [
          { actionType: '123', error: 'Custom error message' },
          { actionType: '456', error: 'Custom error message 2' },
        ],
      })
    );

    expect(state).toEqual({
      entities: {
        '123': {
          actionType: '123',
          viewStatus: errorViewStatus('Custom error message'),
        },
        '456': {
          actionType: '456',
          viewStatus: errorViewStatus('Custom error message 2'),
        },
      },
    });
  });

  it('should reset many actions to the state', () => {
    const state = viewStatesFeature.reducer(
      {
        entities: {
          '123': {
            actionType: '123',
            viewStatus: loadingViewStatus(),
          },
          '456': {
            actionType: '456',
            viewStatus: loadingViewStatus(),
          },
        },
      },
      ViewStateActions.resetMany({
        actionTypes: ['123', '456'],
      })
    );

    expect(state).toEqual({
      entities: {},
    });
  });

  it('should update an existing action from loading to error', () => {
    const loadingState = viewStatesFeature.reducer(
      initialState,
      ViewStateActions.startLoading({
        actionType: '123',
      })
    );

    const errorState = viewStatesFeature.reducer(
      loadingState,
      ViewStateActions.error({
        actionType: '123',
        error: 'Error occurred',
      })
    );

    expect(errorState).toEqual({
      entities: {
        '123': {
          actionType: '123',
          viewStatus: errorViewStatus('Error occurred'),
        },
      },
    });

    expect(errorState).not.toBe(loadingState);
  });

  it('should maintain state immutability when adding a loading action', () => {
    const originalState = { ...initialState };
    const newState = viewStatesFeature.reducer(
      originalState,
      ViewStateActions.startLoading({
        actionType: '123',
      })
    );

    expect(newState).not.toBe(originalState);
    expect(newState.entities).not.toBe(originalState.entities);
  });

  it('should not modify state when removing a non-existent action', () => {
    const originalState = { ...initialState };
    const newState = viewStatesFeature.reducer(
      originalState,
      ViewStateActions.reset({
        actionType: 'non-existent',
      })
    );

    expect(newState).toBe(originalState);
  });

  it('should not modify state when adding the same loading action twice', () => {
    const loadingState = viewStatesFeature.reducer(
      initialState,
      ViewStateActions.startLoading({
        actionType: '123',
      })
    );

    const updatedState = viewStatesFeature.reducer(
      loadingState,
      ViewStateActions.startLoading({
        actionType: '123',
      })
    );

    expect(updatedState).toBe(loadingState);
  });

  it('should update state when adding different error messages for the same action', () => {
    const errorState1 = viewStatesFeature.reducer(
      initialState,
      ViewStateActions.error({
        actionType: '123',
        error: {
          message: 'Error 1',
        },
      })
    );

    const errorState2 = viewStatesFeature.reducer(
      errorState1,
      ViewStateActions.error({
        actionType: '123',
        error: {
          message: 'Error 3',
        },
      })
    );

    expect(errorState2).not.toBe(errorState1);
    expect((errorState2.entities['123'].viewStatus as ViewError).error).toEqual({
      message: 'Error 3',
    });
  });

  it('should only reset existing actions when using resetMany', () => {
    const originalState = {
      entities: {
        '123': {
          actionType: '123',
          viewStatus: loadingViewStatus(),
        },
      },
    };

    const newState = viewStatesFeature.reducer(
      originalState,
      ViewStateActions.resetMany({
        actionTypes: ['123', 'non-existent'],
      })
    );

    expect(newState).toEqual({
      entities: {},
    });
    expect(newState).not.toBe(originalState);
  });

  it('should not modify state when errorMany is called with an empty array', () => {
    const originalState = { ...initialState };
    const newState = viewStatesFeature.reducer(
      originalState,
      ViewStateActions.errorMany({
        actionTypes: [],
      })
    );

    expect(newState).toBe(originalState);
  });

  it('should not modify state when resetMany is called with an empty array', () => {
    const originalState = { ...initialState };
    const newState = viewStatesFeature.reducer(
      originalState,
      ViewStateActions.resetMany({
        actionTypes: [],
      })
    );

    expect(newState).toBe(originalState);
  });
});
