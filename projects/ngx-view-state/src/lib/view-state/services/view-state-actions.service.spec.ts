import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';

import { ViewStateActionsConfig, ViewStateActionsService } from './view-state-actions.service';

describe('ViewStateActionsService', () => {
	let service: ViewStateActionsService;

	const loadData: Action = { type: 'load data' };
	const loadDataSuccess: Action = { type: 'data loaded success' };
	const lodDataFailure: Action = { type: 'data loaded failure' };

	const loadData2: Action = { type: 'load data 2' };
	const loadDataSuccess2: Action = { type: 'data loaded success 2' };
	const lodDataFailure2: Action = { type: 'data loaded failure 2' };

	const actionsConfig: ViewStateActionsConfig[] = [
		{
			startLoadingOn: loadData,
			resetOn: [loadDataSuccess, loadData2],
			errorOn: [lodDataFailure, lodDataFailure2]
		},
		{
			startLoadingOn: loadData2,
			resetOn: [loadDataSuccess2],
			errorOn: [lodDataFailure2]
		}
	];

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ViewStateActionsService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	beforeEach(() => {
		service.add(actionsConfig);
	});

	it('should contain correct actions', () => {
		expect(service.getActionConfigs(loadData)).toEqual([{ viewState: 'startLoading' }]);
		expect(service.getActionConfigs(loadDataSuccess)).toEqual([{ viewState: 'reset', actionType: loadData.type }]);
		expect(service.getActionConfigs(lodDataFailure)).toEqual([{ viewState: 'error', actionType: loadData.type }]);

		expect(service.getActionConfigs(loadData2))
			.toEqual(jasmine.arrayContaining(
					[
						{ viewState: 'startLoading' }, { viewState: 'reset', actionType: loadData.type }
					]
				)
			);
		expect(service.getActionConfigs(loadDataSuccess2)).toEqual([{ viewState: 'reset', actionType: loadData2.type }]);
		expect(service.getActionConfigs(lodDataFailure2))
			.toEqual(jasmine.arrayContaining(
					[
						{ viewState: 'error', actionType: loadData2.type }, { viewState: 'error', actionType: loadData.type }
					]
				)
			);
	});

	describe('remove', () => {
		it('should remove config for an action', () => {
			service.remove(loadData);

			expect(service.isViewStateAction(loadData)).toBe(false);
		});

		it('should remove config for an action from other configs', () => {
			service.remove(loadData);

			expect(service.getActionConfigs(loadData2)).toEqual([{ viewState: 'startLoading' }]);
		})
	})

	describe('isStartLoadingAction', () => {
		it('should return true for loadData action', () => {
			expect(service.isStartLoadingAction(loadData)).toBe(true);
		});

		it('should return false for loadDataSuccess', () => {
			expect(service.isStartLoadingAction(loadDataSuccess)).toBe(false);
		});

		it('should return false for lodDataFailure', () => {
			expect(service.isStartLoadingAction(lodDataFailure)).toBe(false);
		});

		it('should return true for loadData2', () => {
			expect(service.isStartLoadingAction(loadData2)).toBe(true);
		});
	});

	describe('isResetLoadingAction', () => {
		it('should return true for loadDataSuccess', () => {
			expect(service.isResetLoadingAction(loadDataSuccess)).toBe(true);
		});

		it('should return true for lodDataFailure', () => {
			expect(service.isResetLoadingAction(lodDataFailure)).toBe(false);
		});

		it('should return false for loadData', () => {
			expect(service.isResetLoadingAction(loadData)).toBe(false);
		});

		it('should return true for loadDataSuccess2', () => {
			expect(service.isResetLoadingAction(loadDataSuccess2)).toBe(true);
		});

		it('should return true for loadData2', () => {
			expect(service.isResetLoadingAction(loadData2)).toBe(true);
		});
	});

	describe('isErrorAction', () => {
		it('should return true for loadDataFailure', () => {
			expect(service.isErrorAction(lodDataFailure)).toBe(true);
		});

		it('should return false for loadDataSuccess', () => {
			expect(service.isErrorAction(loadDataSuccess)).toBe(false);
		});

		it('should return false for loadData', () => {
			expect(service.isErrorAction(loadData)).toBe(false);
		});

		it('should return true for loadDataFailure2', () => {
			expect(service.isErrorAction(lodDataFailure2)).toBe(true);
		});
	});
});
