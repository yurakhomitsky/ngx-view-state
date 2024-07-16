import { createViewStateFeature } from 'ngx-view-state';


export const { viewStatesFeature, selectActionViewStatus, selectIsAnyActionLoading } = createViewStateFeature<string>()
