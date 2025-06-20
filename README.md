<h1>NgxViewState</h1>


> Library for managing Loading/Success/Error in Angular applications that use NgRx.


This repository contains an Angular library `ngx-view-state` and a small demo application showing how to use it. The library helps manage view states (Loading, Success, Error, Idle) in applications that use NgRx for state management.

## Library Documentation

For more information about the library, please refer to the [library documentation](./projects/ngx-view-state/README.md)

## Development server

Run `npm run build-lib watch` to build the library.

Run `npm run start` for a dev server for the Application. Navigate to `http://localhost:4200/`

## Demo Application

The demo in `src/app` uses the library with an NgRx store. `TodosEffects` demonstrates how to register actions with `ViewStateActionsService` so that load/add/update/delete actions update the view state automatically.

The `TodosComponent` selects view states via selectors (`selectTodosViewStatus`, `selectActionsLoading`) and displays content with `*ngxViewState`.


#### Demo Stackblitz

[https://stackblitz.com/edit/ngx-view-state](https://stackblitz.com/edit/ngx-view-state)

