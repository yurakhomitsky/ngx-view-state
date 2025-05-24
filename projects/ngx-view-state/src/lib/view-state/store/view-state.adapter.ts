import { ViewStatus } from '../models/view-status.model';
import { ViewStatusEnum } from '../models/view-status.enum';
import { EntityState, ViewState } from './view-state.model';

export function upsertOne<E>(entity: ViewState<E>, state: EntityState<ViewState<E>>): EntityState<ViewState<E>> {
	return upsertMany([entity], state);
}

export function upsertMany<E>(entities: ViewState<E>[], state: EntityState<ViewState<E>>): EntityState<ViewState<E>> {
	let hasChanged = false;
	const newEntities = { ...state.entities };

	for (const entity of entities) {
		const prev = state.entities[entity.actionType];
		// Only update if new or viewStatus changed
		if (!prev || !shallowEqualViewStatus(prev.viewStatus, entity.viewStatus)) {
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

export function shallowEqualViewStatus(a: ViewStatus, b: ViewStatus): boolean {
	if (a.type !== b.type) return false;
	if (a.type === ViewStatusEnum.ERROR && b.type === ViewStatusEnum.ERROR) {
		return a.error === b.error;
	}
	return true;
}
