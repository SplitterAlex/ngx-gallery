import {
  Component,
  Input,
  ChangeDetectionStrategy,
  HostBinding,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';
import { GalleryConfig } from '../models/config.model';

@Component({
  selector: 'gallery-thumb',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gallery-image
      [src]="src"
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
export class GalleryThumbComponent implements OnInit {
  @Input() config: GalleryConfig;

  /** Item's index in the gallery */
  @Input() index: number;

  /** Gallery current index */
  @Input() currIndex: number;

  /** Item's type 'image', 'video', 'youtube', 'iframe' */
  @Input() type: string;

  /** Item's data, this object contains the data required to display the content (e.g. src path) */
  @Input() data: any;

  @Input()
  set src(src: string) {
    this._thumbSrc = src;
    // this._cdr.detectChanges();
  }
  get src(): string {
    return this._thumbSrc;
  }
  private _thumbSrc: string;

  @Output() error = new EventEmitter<Error>();

  @HostBinding('class.g-active-thumb') get isActive() {
    return this.index === this.currIndex;
  }

  constructor(private _el: ElementRef, private _cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (!('IntersectionObserver' in window)) {
      this.src = this.data.thumb;
    }
  }

  loadThumb() {
    this._thumbSrc = this.data.thumb;
    this._cdr.detectChanges();
  }

  get nativeElement() {
    return this._el.nativeElement;
  }
}
