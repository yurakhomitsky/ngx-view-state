import { emptyViewStatus, errorViewStatus, loadingViewStatus } from '../factories';

import { ViewStateActions } from './view-state.actions';
import { initialState, viewStatesFeature } from './view-state.feature';

describe('ViewStateFeature', () => {
  it('should add loading action if its not in the state', () => {
    const state = viewStatesFeature.reducer(
      initialState,
      ViewStateActions.startLoading({
        id: '123',
      }),
    );

    expect(state).toEqual({
      entities: {
        '123': {
          id: '123',
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
            id: '123',
            viewStatus: loadingViewStatus(),
          },
        },
        ids: ['123'],
      },
      ViewStateActions.reset({
        id: '123',
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
        id: '123',
        errorMessage: 'Custom error message',
      }),
    );

    expect(state).toEqual({
      entities: {
        '123': {
          id: '123',
          viewStatus: errorViewStatus('Custom error message'),
        },
      },
      ids: ['123'],
    });
  });

  it('should add empty action to the state', () => {
    const state = viewStatesFeature.reducer(
      {
        entities: {},
        ids: [],
      },
      ViewStateActions.empty({
        id: '123',
        emptyMessage: 'Custom empty message',
      }),
    );

    expect(state).toEqual({
      entities: {
        '123': {
          id: '123',
          viewStatus: emptyViewStatus('Custom empty message'),
        },
      },
      ids: ['123'],
    });
  });
});
