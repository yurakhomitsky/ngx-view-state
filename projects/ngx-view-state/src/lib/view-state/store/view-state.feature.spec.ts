import { errorViewStatus, loadingViewStatus } from '../factories';

import { ViewStateActions } from './view-state.actions';
import { initialState, viewStatesFeature } from './view-state.feature';

describe('ViewStateFeature', () => {
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
});
