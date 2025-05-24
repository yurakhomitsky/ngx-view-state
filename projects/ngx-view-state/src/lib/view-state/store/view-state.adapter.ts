import { ViewState } from './view-state.feature';

export interface Dictionary<T> {
	[id: string]: T;
}

export interface EntityState<T> {
	entities: Dictionary<T>;
}

export function upsertOne<E>(entity: ViewState<E>, state: EntityState<ViewState<E>>): EntityState<ViewState<E>> {
	return {
		entities: {
			...state.entities,
			[entity.actionType]: entity
		}
	};
}

export function upsertMany<E>(entities: ViewState<E>[], state: EntityState<ViewState<E>>): EntityState<ViewState<E>> {
	const newEntities = { ...state.entities };

	for (const entity of entities) {
		newEntities[entity.actionType] = entity;
	}

	return { entities: newEntities };
}

export function removeOne<E>(id: string, state: EntityState<ViewState<E>>): EntityState<ViewState<E>> {
	const { [id]: removed, ...rest } = state.entities;

	return { entities: rest };
}

export function removeMany<E>(ids: string[], state: EntityState<ViewState<E>>): EntityState<ViewState<E>> {
	const newEntities = { ...state.entities };

	for (const id of ids) {
		delete newEntities[id];
	}

	return { entities: newEntities };
}
