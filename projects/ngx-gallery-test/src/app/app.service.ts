import { ImageItem } from '@ngx-gallery/core';
import { Injectable } from '@angular/core';
import { NgCockpitApiService, NgCockpitCollection } from 'ng-cockpit';
import { Observable } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _data$: Observable<any>;

  constructor(private _api: NgCockpitApiService) {}

  getEntries(): Observable<any> {
    if (!this._data$) {
      this._data$ = this._fetchData().pipe(shareReplay(1));
    }
    return this._data$;
  }

  private _fetchData(): Observable<any> {
    return this._api.fetchCollection<any>('portfolio').pipe(map(this._mapData));
  }

  private _mapData(data: NgCockpitCollection<any>): any {
    const newData = data.entries[0].images.map(entry => {
      const image = new ImageItem({
        src: entry.path,
        thumb: entry.styles[1].path,
        description: entry.meta.description
      });
      return image;
    });
    // return newData.slice(0, 4);
    return newData;
  }
}
