import { createViewStateFeature } from 'ngx-view-state';


export const { viewStatesFeature, selectActionStatus, selectLoadingActions } = createViewStateFeature<string>()
