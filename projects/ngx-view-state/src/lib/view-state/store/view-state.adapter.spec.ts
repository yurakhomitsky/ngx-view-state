import { EntityState, ViewState } from './view-state.model';
import { removeMany, removeOne, upsertMany, upsertOne } from './view-state.adapter';
import { errorViewStatus, loadedViewStatus, loadingViewStatus } from '../factories';

describe('ViewStateAdapter', () => {
  describe('upsertOne', () => {
    it('should add entity to empty state', () => {
      const initialState: EntityState<ViewState<string>> = { entities: {} };
      const entity: ViewState<string> = {
        actionType: 'test-action',
        viewStatus: loadingViewStatus(),
      };

      const result = upsertOne(entity, initialState);

      expect(result).toEqual({
        entities: {
          'test-action': entity,
        },
      });
      // Verify state immutability
      expect(result).not.toBe(initialState);
    });

    it('should update entity if viewStatus changed', () => {
      const entity: ViewState<string> = {
        actionType: 'test-action',
        viewStatus: loadingViewStatus(),
      };
      const initialState: EntityState<ViewState<string>> = {
        entities: {
          'test-action': entity,
        },
      };
      const updatedEntity: ViewState<string> = {
        actionType: 'test-action',
        viewStatus: errorViewStatus('Error message'),
      };

      const result = upsertOne(updatedEntity, initialState);

      expect(result).toEqual({
        entities: {
          'test-action': updatedEntity,
        },
      });
      expect(result).not.toBe(initialState);
    });

    it('should not update state if viewStatus has not changed', () => {
      const entity: ViewState<string> = {
        actionType: 'test-action',
        viewStatus: loadingViewStatus(),
      };
      const initialState: EntityState<ViewState<string>> = {
        entities: {
          'test-action': entity,
        },
      };
      const sameEntity: ViewState<string> = {
        actionType: 'test-action',
        viewStatus: loadingViewStatus(),
      };

      const result = upsertOne(sameEntity, initialState);

      expect(result).toBe(initialState); // Same reference, no change
    });
  });

  describe('upsertMany', () => {
    it('should add multiple entities to empty state', () => {
      const initialState: EntityState<ViewState<string>> = { entities: {} };
      const entities: ViewState<string>[] = [
        {
          actionType: 'action-1',
          viewStatus: loadingViewStatus(),
        },
        {
          actionType: 'action-2',
          viewStatus: errorViewStatus('Error message'),
        },
      ];

      const result = upsertMany(entities, initialState);

      expect(result).toEqual({
        entities: {
          'action-1': entities[0],
          'action-2': entities[1],
        },
      });
      expect(result).not.toBe(initialState);
    });

    it('should update only entities with changed viewStatus', () => {
      const initialState: EntityState<ViewState<string>> = {
        entities: {
          'action-1': {
            actionType: 'action-1',
            viewStatus: loadingViewStatus(),
          },
          'action-2': {
            actionType: 'action-2',
            viewStatus: errorViewStatus('Old error'),
          },
        },
      };
      const entities: ViewState<string>[] = [
        {
          actionType: 'action-1',
          viewStatus: loadingViewStatus(), // Same status
        },
        {
          actionType: 'action-2',
          viewStatus: errorViewStatus('New error'), // Different error
        },
      ];

      const result = upsertMany(entities, initialState);

      expect(result).toEqual({
        entities: {
          'action-1': initialState.entities['action-1'], // Should be the same reference
          'action-2': entities[1], // Should be updated
        },
      });
      expect(result).not.toBe(initialState);
      expect(result.entities['action-1']).toBe(initialState.entities['action-1']);
      expect(result.entities['action-2']).toBe(entities[1]);
    });

    it('should not update state if no viewStatus has changed', () => {
      const initialState: EntityState<ViewState<string>> = {
        entities: {
          'action-1': {
            actionType: 'action-1',
            viewStatus: loadingViewStatus(),
          },
          'action-2': {
            actionType: 'action-2',
            viewStatus: errorViewStatus('Error message'),
          },
        },
      };
      const entities: ViewState<string>[] = [
        {
          actionType: 'action-1',
          viewStatus: loadingViewStatus(),
        },
        {
          actionType: 'action-2',
          viewStatus: errorViewStatus('Error message'),
        },
      ];

      const result = upsertMany(entities, initialState);

      expect(result).toBe(initialState); // Same reference, no change
    });
  });

  describe('removeOne', () => {
    it('should remove entity from state', () => {
      const initialState: EntityState<ViewState<string>> = {
        entities: {
          'action-1': {
            actionType: 'action-1',
            viewStatus: loadingViewStatus(),
          },
          'action-2': {
            actionType: 'action-2',
            viewStatus: errorViewStatus('Error message'),
          },
        },
      };

      const result = removeOne('action-1', initialState);

      expect(result).toEqual({
        entities: {
          'action-2': initialState.entities['action-2'],
        },
      });
      expect(result).not.toBe(initialState);
    });

    it('should not update state if entity does not exist', () => {
      const initialState: EntityState<ViewState<string>> = {
        entities: {
          'action-1': {
            actionType: 'action-1',
            viewStatus: loadingViewStatus(),
          },
        },
      };

      const result = removeOne('non-existent', initialState);

      expect(result).toBe(initialState); // Same reference, no change
    });
  });

  describe('removeMany', () => {
    it('should remove multiple entities from state', () => {
      const initialState: EntityState<ViewState<string>> = {
        entities: {
          'action-1': {
            actionType: 'action-1',
            viewStatus: loadingViewStatus(),
          },
          'action-2': {
            actionType: 'action-2',
            viewStatus: errorViewStatus('Error message'),
          },
          'action-3': {
            actionType: 'action-3',
            viewStatus: loadedViewStatus(),
          },
        },
      };

      const result = removeMany(['action-1', 'action-3'], initialState);

      expect(result).toEqual({
        entities: {
          'action-2': initialState.entities['action-2'],
        },
      });
      expect(result).not.toBe(initialState);
    });

    it('should not update state if no entities exist', () => {
      const initialState: EntityState<ViewState<string>> = {
        entities: {
          'action-1': {
            actionType: 'action-1',
            viewStatus: loadingViewStatus(),
          },
        },
      };

      const result = removeMany(['non-existent-1', 'non-existent-2'], initialState);

      expect(result).toBe(initialState); // Same reference, no change
    });

    it('should remove only existing entities', () => {
      const initialState: EntityState<ViewState<string>> = {
        entities: {
          'action-1': {
            actionType: 'action-1',
            viewStatus: loadingViewStatus(),
          },
          'action-2': {
            actionType: 'action-2',
            viewStatus: errorViewStatus('Error message'),
          },
        },
      };

      const result = removeMany(['action-1', 'non-existent'], initialState);

      expect(result).toEqual({
        entities: {
          'action-2': initialState.entities['action-2'],
        },
      });
      expect(result).not.toBe(initialState);
    });
  });
});
