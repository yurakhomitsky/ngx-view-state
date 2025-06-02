import { EntityState, ViewState } from './view-state.model';
import { areViewStatusesEqual } from '../helpers';

export function upsertOne<E>(entity: ViewState<E>, state: EntityState<ViewState<E>>): EntityState<ViewState<E>> {
  return upsertMany([entity], state);
}

export function upsertMany<E>(entities: ViewState<E>[], state: EntityState<ViewState<E>>): EntityState<ViewState<E>> {
  let hasChanged = false;
  const newEntities = { ...state.entities };

  for (const entity of entities) {
    const prev = state.entities[entity.actionType];
    // Only update if new or viewStatus changed

    if (!prev || !areViewStatusesEqual(prev.viewStatus, entity.viewStatus)) {
      newEntities[entity.actionType] = entity;
      hasChanged = true;
    }
  }

  return hasChanged ? { entities: newEntities } : state;
}

export function removeOne<E>(id: string, state: EntityState<ViewState<E>>): EntityState<ViewState<E>> {
  return removeMany([id], state);
}

export function removeMany<E>(ids: string[], state: EntityState<ViewState<E>>): EntityState<ViewState<E>> {
  let hasChanged = false;
  const newEntities = { ...state.entities };

  for (const id of ids) {
    if (id in newEntities) {
      delete newEntities[id];
      hasChanged = true;
    }
  }

  return hasChanged ? { entities: newEntities } : state;
}
