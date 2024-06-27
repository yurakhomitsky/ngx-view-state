import { errorViewStatus, loadingViewStatus } from '../factories';

import { ViewStateActions } from './view-state.actions';
import { createViewStateFeature } from './view-state.feature';

describe('ViewStateFeature', () => {
  const { viewStatesFeature, initialState } = createViewStateFeature<string>();
  it('should add loading action if its not in the state', () => {
    const state = viewStatesFeature.reducer(
      initialState,
      ViewStateActions.startLoading({
        actionType: '123',
      }),
    );

    expect(state).toEqual({
      entities: {
        '123': {
          actionType: '123',
          viewStatus: loadingViewStatus(),
        },
      },
      ids: ['123'],
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
        ids: ['123'],
      },
      ViewStateActions.reset({
        actionType: '123',
      }),
    );

    expect(state).toEqual({
      entities: {},
      ids: [],
    });
  });

  it('should add error action to the state', () => {
    const state = viewStatesFeature.reducer(
      {
        entities: {},
        ids: [],
      },
      ViewStateActions.error({
        actionType: '123',
        error: 'Custom error message',
      }),
    );

    expect(state).toEqual({
      entities: {
        '123': {
          actionType: '123',
          viewStatus: errorViewStatus('Custom error message'),
        },
      },
      ids: ['123'],
    });
  });

  it('should error many actions to the state', () => {
    const state = viewStatesFeature.reducer(
      {
        entities: {},
        ids: [],
      },
      ViewStateActions.errorMany({
        actionTypes: [
          { actionType: '123', error: 'Custom error message' },
          { actionType: '456', error: 'Custom error message 2' },
        ],
      }),
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
      ids: ['123', '456'],
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
        ids: ['123', '456'],
      },
      ViewStateActions.resetMany({
        actionTypes: ['123', '456'],
      }),
    );

    expect(state).toEqual({
      entities: {},
      ids: [],
    });
  })
});
