import { filter, finalize } from 'rxjs/operators';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class LazyLoadThumbService {
  private _intersectionObserver: IntersectionObserver = null;
  private _intersecting$ = new Subject<IntersectionObserverEntry>();

  public isSupported =
    isPlatformBrowser(this._platformId) && 'IntersectionObserver' in window;

  constructor(@Inject(PLATFORM_ID) private _platformId) {}

  observe(
    element: Element,
    containerElement?: Element
  ): Observable<IntersectionObserverEntry> {
    if (!this._intersectionObserver && containerElement) {
      this._intersectionObserver = new IntersectionObserver(
        this._handleIntersect.bind(this),
        {
          root: containerElement,
          rootMargin: '80px',
          threshold: [0.5]
        }
      );
    }
    this._intersectionObserver.observe(element);

    return this._intersecting$.asObservable().pipe(
      filter((entry: IntersectionObserverEntry) => entry.target === element),
      finalize(() => this._intersectionObserver.unobserve(element))
    );
  }

  unobserve(element: Element): void {
    if (this._intersectionObserver) {
      this._intersectionObserver.unobserve(element);
    }
  }

  disconnect() {
    if (this._intersectionObserver) {
      this._intersectionObserver.disconnect();
    }
  }

  private _handleIntersect(entries, observer) {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        this._intersecting$.next(entry);
      }
    });
  }
}
