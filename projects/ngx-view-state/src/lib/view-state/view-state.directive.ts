import { ChangeDetectorRef, Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { ErrorStateComponent, LoadingStateComponent } from './components';
import { ViewStatusEnum } from './models/view-status.enum';
import { ViewStatus } from './models/view-status.model';
import { ViewContextValue, ViewStatusHandlers, ViewTypeConstraint } from './view-state.model';

export interface ViewStateContext<T> {
  /**
   * using `$implicit` to enable `let` syntax: `*appViewState="obs$; let o"`
   */
  $implicit: ViewContextValue<T>
  /**
   * using `appViewState` to enable `as` syntax: `*appViewState="obs$ as o"`
   */
  appViewState: ViewContextValue<T>
}

@Directive({
  selector: '[appViewState]',
  standalone: true,
})
export class ViewStateDirective<T extends ViewTypeConstraint<unknown>> implements OnDestroy {
  static ngTemplateContextGuard<T extends ViewTypeConstraint<unknown>>(
    dir: ViewStateDirective<T>,
    ctx: unknown,
  ): ctx is ViewStateContext<T> {
    return true;
  }

  private _viewState!: T;

  @Input({ required: true, alias: 'appViewState' })
  public set viewState(value: T | null) {
    // If we use the async pipe the first value will be null
    if (value == null) {
      this.viewContainerRef.clear();
      this.createSpinner();
      return;
    }

    this._viewState = value;

    const viewStatus: ViewStatus =
      'type' in value ? value : value.viewStatus;

    this.onViewStateChange({
      viewStatus,
      value: value as ViewContextValue<T>
    });
  }

  public get viewState(): T {
    return this._viewState;
  }

  @Input() public appViewStateLoading?: TemplateRef<ViewStateContext<T>>;

  @Input() public appViewStateError?: TemplateRef<ViewStateContext<T>>;

  @Input() public appViewStateEmpty?: TemplateRef<ViewStateContext<T>>;

  private readonly viewContext: ViewStateContext<T | undefined> = {
    $implicit: undefined,
    appViewState: undefined,
  };

  private viewStatusHandlers: ViewStatusHandlers<ViewStatus, T> = {
    [ViewStatusEnum.IDLE]: () => {
      this.createContent();
    },
    [ViewStatusEnum.LOADING]: () => {
      this.createSpinner();
    },
    [ViewStatusEnum.LOADED]: () => {
      this.createContent();
    },
    [ViewStatusEnum.ERROR]: ({ viewStatus }) => {
      this.createErrorState(viewStatus.error);
    },
  };

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<ViewStateContext<T>>,
    private cdRef: ChangeDetectorRef,
  ) {}

  public ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }

  private onViewStateChange(viewModel: { viewStatus: ViewStatus; value: ViewContextValue<T> }): void {
    this.viewContainerRef.clear();
    this.viewContext.$implicit = viewModel.value;
    this.viewContext.appViewState = viewModel.value;

    this.viewStatusHandlers[viewModel.viewStatus.type](viewModel as never);
    this.cdRef.detectChanges();
  }

  private createContent(): void {
    this.viewContainerRef.createEmbeddedView(this.templateRef, this.viewContext);
  }

  private createSpinner(): void {
    if (this.appViewStateLoading) {
      this.viewContainerRef.createEmbeddedView(this.appViewStateLoading, this.viewContext);
    } else {
      this.viewContainerRef.createComponent(LoadingStateComponent);
    }
  }

  private createErrorState(error?: unknown): void {
    if (this.appViewStateError) {
      this.viewContainerRef.createEmbeddedView(this.appViewStateError, this.viewContext);
    } else {
      const component = this.viewContainerRef.createComponent(ErrorStateComponent);

      component.setInput('error', error);
    }
  }
}
