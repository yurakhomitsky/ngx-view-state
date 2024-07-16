## Changelog

## 3.0.0

General changes:
- Update README.md
- Rename and new properties,methods,functions


- `createViewStateFeature`:
  - Rename:
    -  `viewStatesFeatureKey` to `viewStatesFeatureName`
    -  `selectActionStatus` to `selectActionViewStatus`
    -  `selectLoadingActions` to `selectIsAnyActionLoading`
    - `selectViewStateIds` to `selectViewStateActionTypes`
  - New:
    - `selectIsAnyActionError`
    - `selectIsAnyActionLoaded`
    - `selectIsAnyActionIdle`


- `ViewStateActionService`
  - New:
    - `remove` method

## 2.1.0

- fix: If the same action was included in multiple `ViewStateActionsConfig` configs, only last action config would be used. The store, effects and service now correctly handles multiple actions across different configs.

## 2.0.0    

- Rename ViewStateActionsConfig properties
  - `resetLoadingOn` to `resetOn`
  - `error` to `errorOn`


## 1.0.2

- Update peerDependencies and keywords

## 1.0.1

- Update README.md

## 1.0.0

- Initial release
