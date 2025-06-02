import {
  ChangeDetectorRef,
  Directive,
  Inject,
  Input,
  OnDestroy,
  TemplateRef,
  Type,
  ViewContainerRef,
  input,
} from '@angular/core';
import { ViewStatusEnum } from './models/view-status.enum';
import { ViewStatus } from './models/view-status.model';
import { ViewContextValue, ViewStatusHandlers, ViewTypeConstraint } from './view-state.model';
import { ERROR_STATE_COMPONENT, LOADING_STATE_COMPONENT } from './tokens/default-state-components.token';
import { ViewStateErrorComponent } from './models/view-state-component.model';
import { areViewStatusesEqual } from './helpers';

export interface ViewStateContext<T> {
  /**
   * using `$implicit` to enable `let` syntax: `*ngxViewState="obs$; let o"`
   */
  $implicit: ViewContextValue<T>;
  /**
   * using `ngxViewState` to enable `as` syntax: `*ngxViewState="obs$ as o"`
   */
  ngxViewState: ViewContextValue<T>;
}

@Directive({
  selector: '[ngxViewState]',
})
export class ViewStateDirective<T extends ViewTypeConstraint<unknown>> implements OnDestroy {
  static ngTemplateContextGuard<T extends ViewTypeConstraint<unknown>>(
    dir: ViewStateDirective<T>,
    ctx: unknown
  ): ctx is ViewStateContext<T> {
    return true;
  }

  private readonly viewContext: ViewStateContext<T | undefined> = {
    $implicit: undefined,
    ngxViewState: undefined,
  };

  private _viewState!: T;
  private _viewStatus: ViewStatus | null = null;

  @Input({ required: true, alias: 'ngxViewState' })
  public set viewState(value: T | null) {
    // If we use the async pipe, the first value will be null
    if (value == null) {
      this.viewContainerRef.clear();
      this.createSpinner();
      return;
    }

    this._viewState = value;

    const viewStatus: ViewStatus = 'type' in value ? value : value.viewStatus;

    this.updateContext(value);

    if (this._viewStatus && areViewStatusesEqual(this._viewStatus, viewStatus)) {
      return;
    }

    this._viewStatus = viewStatus;

    this.onViewStateChange({
      viewStatus,
      value,
    });
  }

  public get viewState(): T {
    return this._viewState;
  }

  public readonly ngxViewStateLoading = input<TemplateRef<ViewStateContext<T>>>();

  public readonly ngxViewStateError = input<TemplateRef<ViewStateContext<T>>>();

  public readonly ngxViewStateEmpty = input<TemplateRef<ViewStateContext<T>>>();

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
    private templateRef: TemplateRef<ViewStateContext<T | undefined>>,
    private cdRef: ChangeDetectorRef,
    @Inject(ERROR_STATE_COMPONENT)
    private errorStateComponent: Type<ViewStateErrorComponent<unknown>>,
    @Inject(LOADING_STATE_COMPONENT)
    private loadingStateComponent: Type<unknown>
  ) {}

  public ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }

  private onViewStateChange(viewModel: { viewStatus: ViewStatus; value: T }): void {
    this.viewContainerRef.clear();

    this.viewStatusHandlers[viewModel.viewStatus.type](viewModel as never);
    this.cdRef.markForCheck();
  }

  private updateContext(value: T): void {
    this.viewContext.$implicit = value as unknown as ViewContextValue<T>;
    this.viewContext.ngxViewState = value as unknown as ViewContextValue<T>;
  }

  private createContent(): void {
    this.viewContainerRef.createEmbeddedView(this.templateRef, this.viewContext);
  }

  private createSpinner(): void {
    const ngxViewStateLoading = this.ngxViewStateLoading();
    if (ngxViewStateLoading) {
      this.viewContainerRef.createEmbeddedView(ngxViewStateLoading, this.viewContext);
    } else {
      this.viewContainerRef.createComponent(this.loadingStateComponent);
    }
  }

  private createErrorState(error?: unknown): void {
    const ngxViewStateError = this.ngxViewStateError();
    if (ngxViewStateError) {
      this.viewContainerRef.createEmbeddedView(ngxViewStateError, this.viewContext);
    } else {
      const component = this.viewContainerRef.createComponent(this.errorStateComponent);
      component.setInput('viewStateError', error);
    }
  }
}
