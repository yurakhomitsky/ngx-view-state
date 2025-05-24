## Changelog

## 4.1.1
General changes:
- Refactor: Extract reducers, selectors, and models into separate files for better code organization.
- Fix: Remove custom selector memoization that prevented selectors from emitting on state changes when ErrorViewState updates with different error object/message.
- Optimize adapter functions (`upsertMany`, `removeMany`) to avoid unnecessary state updates for unchanged entities.
- Improve selector memoization to ensure selectors only emit on actual state changes.


## 4.1.0

General changes:
- Refactor internal state management to remove dependency on `@ngrx/entity` adapter.
- Replace entity adapter methods with custom adapter functions (`upsertOne`, `upsertMany`, `removeOne`, `removeMany`).
- Remove `ids` array from state, relying directly on `entities` dictionary for managing action state.
- Update tests to reflect removal of `ids` and verify new selectors.

No breaking changes to the public API selectors — backward compatible.

## 4.0.1

General changes:

- Bugfix: Ensure context values update when data changes in ComponentViewModel
- Update `ViewContextValue` type to resolve the correct viewStatus in ComponentViewModel

## 4.0.0

General changes:
- Angular/NgRx update to v19

## 3.2.1

General changes:
- Add custom memo for `selectActionViewStatus` and `selectViewState` selectors to avoid emitting the same view status multiple times
- Update README.md

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

- fix: If the same action was included in multiple `ViewStateActionsConfig` configs, only last action config would be used. The store, effects, and service now correctly handles multiple actions across different configs.

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
