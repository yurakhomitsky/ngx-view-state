import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

describe('LoadingComponent', () => {
	let component: LoadingComponent;
	let fixture: ComponentFixture<LoadingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
				imports: [LoadingComponent],
				providers: [provideExperimentalZonelessChangeDetection()]
			})
			.compileComponents();

		fixture = TestBed.createComponent(LoadingComponent);
		component = fixture.componentInstance;
		await fixture.whenStable();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
