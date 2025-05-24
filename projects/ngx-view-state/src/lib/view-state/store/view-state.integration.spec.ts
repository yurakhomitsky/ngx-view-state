import { Injectable, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Actions, createEffect, EffectsModule, ofType } from '@ngrx/effects';
import { Action, createActionGroup, emptyProps, props, Store, StoreModule } from '@ngrx/store';
import { asyncScheduler, catchError, observeOn, of, Subject, switchMap, takeUntil, throwError } from 'rxjs';
import { map, take, toArray } from 'rxjs/operators';

import { ViewStateErrorProps } from '../models/view-state-props.model';
import { ViewStateActionsService } from '../services/view-state-actions.service';

import { ViewStateActions } from './view-state.actions';
import { ViewStateEffects } from './view-state.effects';
import { createViewStateFeature } from './view-state.feature';
import { ViewStatus } from '../models/view-status.model';
import { errorViewStatus, idleViewStatus, loadingViewStatus } from '../factories';

describe('ViewStateIntegration', () => {
	let store: Store;
	let actions$: Actions;
	const loadFailError = 'Failed to Load Data';
	const addFailError = 'Failed to Add Data';

	const { viewStatesFeature, selectActionViewStatus } = createViewStateFeature<string>();

	const apiService = {
		getData: () => of<string[]>([]),
		addData: (data: string) => of(data)
	};

	const DataActions = createActionGroup({
		source: 'Data',
		events: {
			loadData: emptyProps(),
			loadDataSuccess: props<{ data: string[] }>(),
			loadDataFailure: props<ViewStateErrorProps>(),

			addData: props<{ data: string }>(),
			addDataSuccess: props<{ data: string }>(),
			addDataFailure: props<ViewStateErrorProps>(),

			loadBooks: emptyProps(),
			loadBooksSuccess: emptyProps(),
			loadBooksFailure: props<ViewStateErrorProps<{ message: string }>>(),

			saveBook: emptyProps(),
			saveBookSuccess: emptyProps()
		}
	});

	@Injectable()
	class DataEffects {
		public getData$ = this.getData();
		public addData$ = this.addData();

		constructor(
			private actions$: Actions,
			private viewStateActionsService: ViewStateActionsService
		) {
			this.viewStateActionsService.add([
				{
					startLoadingOn: DataActions.loadData,
					resetOn: [DataActions.loadDataSuccess, DataActions.addData],
					errorOn: [DataActions.loadDataFailure, DataActions.addDataFailure]
				},
				{
					startLoadingOn: DataActions.addData,
					resetOn: [DataActions.addDataSuccess],
					errorOn: [DataActions.addDataFailure]
				},
				{
					startLoadingOn: DataActions.loadBooks,
					resetOn: [DataActions.loadBooksSuccess],
					errorOn: [DataActions.loadBooksFailure]
				},
				{
					startLoadingOn: DataActions.saveBook,
					resetOn: [DataActions.saveBookSuccess],
					errorOn: []
				}
			]);
		}

		private getData() {
			return createEffect(() => {
				return this.actions$.pipe(
					ofType(DataActions.loadData),
					switchMap(() => {
						return apiService.getData().pipe(
							map((data: string[]) => {
								return DataActions.loadDataSuccess({
									data
								});
							}),
							catchError(() => {
								return of(DataActions.loadDataFailure({ viewStateError: loadFailError }));
							})
						);
					})
				);
			});
		}

		private addData() {
			return createEffect(() => {
				return this.actions$.pipe(
					ofType(DataActions.addData),
					switchMap(({ data }) => {
						return apiService.addData(data).pipe(
							map(() => {
								return DataActions.addDataSuccess({
									data
								});
							}),
							catchError(() => {
								return of(DataActions.addDataFailure({ viewStateError: addFailError }));
							})
						);
					})
				);
			});
		}
	}

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				StoreModule.forRoot({}),
				EffectsModule.forRoot([]),
				StoreModule.forFeature(viewStatesFeature),
				EffectsModule.forFeature([ViewStateEffects, DataEffects])
			],
			providers: [
				provideExperimentalZonelessChangeDetection()
			]
		}).compileComponents();

		store = TestBed.inject(Store);
		actions$ = TestBed.inject(Actions);
	});

	describe('loadData action', () => {
		it('should handle success data loading correctly', (done) => {
			const dataExpected: Action[] = [
				DataActions.loadData(),
				ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
				DataActions.loadDataSuccess({ data: ['Hello', 'Word'] }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] })
			];


			actions$.pipe(
				take(dataExpected.length),
				toArray()
			).subscribe((result) => {
				expect(dataExpected).toEqual(result);
				done();
			});

			spyOn(apiService, 'getData').and.returnValue(of(['Hello', 'Word']));

			store.dispatch(DataActions.loadData());
		});

		it('should handle failure data loading correctly', (done) => {
			const dataExpected: Action[] = [
				DataActions.loadData(),
				ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
				DataActions.loadDataFailure({ viewStateError: loadFailError }),
				ViewStateActions.errorMany({ actionTypes: [{ actionType: DataActions.loadData.type, error: loadFailError }] })
			];

			actions$.pipe(
				take(dataExpected.length),
				toArray()
			).subscribe((result) => {
				expect(dataExpected).toEqual(result);
				done();
			});

			spyOn(apiService, 'getData').and.returnValue(throwError(() => new Error('Oops')));

			store.dispatch(DataActions.loadData());
		});
	});

	describe('addData action', () => {
		it('should handle success data adding correctly', (done) => {
			const dataExpected: Action[] = [
				DataActions.addData({ data: 'Hello' }),
				ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
				DataActions.addDataSuccess({ data: 'Hello' }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.addData.type] })
			];

			actions$.pipe(
				take(dataExpected.length),
				toArray()
			).subscribe((result) => {
				expect(dataExpected).toEqual(result);
				done();
			});

			spyOn(apiService, 'addData').and.returnValue(of('Hello'));

			store.dispatch(DataActions.addData({ data: 'Hello' }));
		});

		it('should handle failure data adding correctly', (done) => {
			const dataExpected: Action[] = [
				DataActions.addData({ data: 'Hello Oops' }),
				ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
				DataActions.addDataFailure({ viewStateError: addFailError }),
				ViewStateActions.errorMany({
					actionTypes: [
						{ actionType: DataActions.loadData.type, error: addFailError },
						{ actionType: DataActions.addData.type, error: addFailError }
					]
				})
			];

			actions$.pipe(
				take(dataExpected.length),
				toArray()
			).subscribe((result) => {
				expect(dataExpected).toEqual(result);
				done();
			});

			spyOn(apiService, 'addData').and.returnValue(throwError(() => new Error('Oops')));

			store.dispatch(DataActions.addData({ data: 'Hello Oops' }));

		});
	});


	describe('loadData action async and addData action', () => {
		it('should reset loadData action after addData action', (done) => {
			const dataExpected: Action[] = [
				DataActions.loadData(),
				ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
				DataActions.addData({ data: 'Add Hello' }),
				ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
				DataActions.addDataSuccess({ data: 'Add Hello' }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.addData.type] }),
				DataActions.loadDataSuccess({ data: ['Hello', 'World'] }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] })
			];

			actions$.pipe(
				take(dataExpected.length),
				toArray()
			).subscribe((result) => {
				expect(dataExpected).toEqual(result);
				done();
			});

			jasmine.clock().install();

			spyOn(apiService, 'getData').and.returnValue(of(['Hello', 'World']).pipe(
				observeOn(asyncScheduler)
			));


			store.dispatch(DataActions.loadData());
			store.dispatch(DataActions.addData({ data: 'Add Hello' }));

			jasmine.clock().tick(1);
			jasmine.clock().uninstall();
		});

		it('should error loadData action after addData action', (done) => {
			const dataExpected: Action[] = [
				DataActions.loadData(),
				ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
				DataActions.addData({ data: 'Add Hello Oops' }),
				ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
				DataActions.addDataFailure({ viewStateError: addFailError }),
				ViewStateActions.errorMany({
					actionTypes: [{
						actionType: DataActions.loadData.type,
						error: addFailError
					}, { actionType: DataActions.addData.type, error: addFailError }]
				}),
				DataActions.loadDataSuccess({ data: ['Hello', 'World'] }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] })
			];

			actions$
				.pipe(
					take(dataExpected.length),
					toArray()
				).subscribe((result) => {
				expect(dataExpected).toEqual(result);
				done();
			});


			jasmine.clock().install();

			spyOn(apiService, 'getData').and.returnValue(of(['Hello', 'World']).pipe(
				observeOn(asyncScheduler)
			));

			spyOn(apiService, 'addData').and.returnValue(throwError(() => new Error('Oops')));

			store.dispatch(DataActions.loadData());
			store.dispatch(DataActions.addData({ data: 'Add Hello Oops' }));

			jasmine.clock().tick(1);
			jasmine.clock().uninstall();
		});
	});

	describe('loadData action sync and addData action', () => {
		it('should reset loadData action after addData action', () => {
			const dataExpected: Action[] = [
				DataActions.loadData(),
				ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
				DataActions.loadDataSuccess({ data: ['Hello', 'World'] }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
				DataActions.addData({ data: 'Add Hello' }),
				ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
				DataActions.addDataSuccess({ data: 'Add Hello' }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.addData.type] })
			];

			actions$.pipe(
				take(dataExpected.length),
				toArray()
			).subscribe((result) => {
				expect(dataExpected).toEqual(result);
			});

			spyOn(apiService, 'getData').and.returnValue(of(['Hello', 'World']));

			store.dispatch(DataActions.loadData());
			store.dispatch(DataActions.addData({ data: 'Add Hello' }));
		});

		it('should error loadData action after addData action', () => {
			const dataExpected: Action[] = [
				DataActions.loadData(),
				ViewStateActions.startLoading({ actionType: DataActions.loadData.type }),
				DataActions.loadDataSuccess({ data: ['Hello', 'World'] }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
				DataActions.addData({ data: 'Add Hello Oops' }),
				ViewStateActions.startLoading({ actionType: DataActions.addData.type }),
				ViewStateActions.resetMany({ actionTypes: [DataActions.loadData.type] }),
				DataActions.addDataFailure({ viewStateError: addFailError }),
				ViewStateActions.errorMany({
					actionTypes: [{
						actionType: DataActions.loadData.type,
						error: addFailError
					}, { actionType: DataActions.addData.type, error: addFailError }]
				})
			];

			actions$.pipe(
				take(dataExpected.length),
				toArray()
			).subscribe((result) => {
				expect(dataExpected).toEqual(result);
			});

			spyOn(apiService, 'getData').and.returnValue(of(['Hello', 'World']));
			spyOn(apiService, 'addData').and.returnValue(throwError(() => new Error('Oops')));

			store.dispatch(DataActions.loadData());
			store.dispatch(DataActions.addData({ data: 'Add Hello Oops' }));
		});
	});

	describe('Select ViewState', () => {
		let viewStatuses: ViewStatus[];
		let subject: Subject<void>

		beforeEach(() => {
			viewStatuses = [];
			subject = new Subject();
			store.select(selectActionViewStatus(DataActions.loadBooks)).pipe(
				takeUntil(subject)
			).subscribe((viewStatus) => {
				viewStatuses.push(viewStatus);
			});
		});

		afterEach(() => {
			subject.next();
			subject.complete();
		});

		it('should not trigger selector when dispatch actions not related to one we listen', () => {
			store.dispatch(DataActions.loadBooks());
			store.dispatch(DataActions.loadBooksSuccess());

			store.dispatch(DataActions.saveBook());
			store.dispatch(DataActions.saveBookSuccess());
			store.dispatch(DataActions.saveBookSuccess());

			expect(viewStatuses).toEqual([idleViewStatus(), loadingViewStatus(), idleViewStatus()]);
		});

		it('should not emit duplicated view status', () => {
			store.dispatch(DataActions.loadBooks());
			store.dispatch(DataActions.loadBooks());
			store.dispatch(DataActions.loadBooks());
			store.dispatch(DataActions.loadBooksSuccess());


			expect(viewStatuses).toEqual([idleViewStatus(), loadingViewStatus(), idleViewStatus()]);
		})

		it('should emit error view status when if error object changes', () => {
			store.dispatch(DataActions.loadBooksFailure({ viewStateError: { message: 'Error-1' } }));
			store.dispatch(DataActions.loadBooksFailure({ viewStateError: { message: 'Error-1' } }));
			store.dispatch(DataActions.loadBooksFailure({ viewStateError: { message: 'Error-2' } }));

			expect(viewStatuses).toEqual([idleViewStatus(), errorViewStatus({ message: 'Error-1' }), errorViewStatus({ message: 'Error-1' }), errorViewStatus({ message: 'Error-2'})]);
		})
	});
});
