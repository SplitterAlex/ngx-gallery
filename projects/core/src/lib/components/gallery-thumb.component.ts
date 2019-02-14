import { LazyLoadThumbService } from './../services/lazy-load-thumb.service';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  HostBinding,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectorRef,
  AfterViewInit,
  OnInit,
  OnDestroy
} from '@angular/core';
import { GalleryConfig } from '../models/config.model';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'gallery-thumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gallery-image
      [src]="thumbSrc"
      mode="indeterminate"
      [isThumbnail]="true"
      [loadingIcon]="config.thumbLoadingIcon"
      [loadingError]="config.thumbLoadingError"
      (error)="error.emit($event)"
    >
    </gallery-image>

    <div *ngIf="config.thumbTemplate" class="g-template g-thumb-template">
      <ng-container
        *ngTemplateOutlet="
          config.thumbTemplate;
          context: { index: this.index, type: this.type, data: this.data }
        "
      >
      </ng-container>
    </div>
  `
})
export class GalleryThumbComponent implements OnInit, OnDestroy, AfterViewInit {
  private _lazyLoadSubscribtion: Subscription;

  public thumbSrc: string;

  @Input() config: GalleryConfig;

  /** Item's index in the gallery */
  @Input() index: number;

  /** Gallery current index */
  @Input() currIndex: number;

  /** Item's type 'image', 'video', 'youtube', 'iframe' */
  @Input() type: string;

  /** Item's data, this object contains the data required to display the content (e.g. src path) */
  @Input() data: any;

  @Input() thumbsContainerEl: Element;

  @Output() error = new EventEmitter<Error>();

  @HostBinding('class.g-active-thumb') get isActive() {
    return this.index === this.currIndex;
  }

  constructor(
    private _el: ElementRef,
    private _cdr: ChangeDetectorRef,
    private _lazyLoadThumbService: LazyLoadThumbService
  ) {}

  ngOnInit() {
    if (!this._lazyLoadThumbService.isSupported) {
      this.thumbSrc = this.data.thumb;
    }
  }

  ngAfterViewInit() {
    if (this._lazyLoadThumbService.isSupported) {
      this._lazyLoadSubscribtion = this._lazyLoadThumbService
        .observe(this._el.nativeElement, this.thumbsContainerEl)
        .pipe(take(1))
        .subscribe(() => {
          this.thumbSrc = this.data.thumb;
          this._cdr.detectChanges();
        });
    }
  }

  ngOnDestroy() {
    if (this._lazyLoadSubscribtion) {
      this._lazyLoadSubscribtion.unsubscribe();
    }
  }
}
