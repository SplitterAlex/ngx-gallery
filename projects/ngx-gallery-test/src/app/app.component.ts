import { Lightbox } from '@ngx-gallery/lightbox';
import { Gallery, GalleryComponent } from '@ngx-gallery/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <ng-container *ngIf="data">
      <button (click)="onClick()">open gallery</button>
      <button (click)="newItem()">new item</button>
      <button (click)="removeItem()">remove</button>

      <gallery
        class="gallery"
        [items]="data"
        [panSensitivity]="2"
        [loadingMode]="'indeterminate'"
      ></gallery>
    </ng-container>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(GalleryComponent, {static: false}) galleryComponent: GalleryComponent;

  public data;
  constructor(
    private _appService: AppService,
    private _gallery: Gallery,
    private _lightbox: Lightbox
  ) {}

  ngOnInit() {
    this._appService.getEntries().subscribe(data => (this.data = data));
  }

  onClick() {
    const galleryRef = this._gallery.ref('portfolio', {
      // gestures: true,
      // itemTemplate: this.itemTemplate,
      panSensitivity: 2,
      loadingMode: 'indeterminate'
    });

    galleryRef.load(this.data);
    this._lightbox.open(10, 'portfolio', {
      panelClass: 'fullscreen'
    });
    this._lightbox.closed.pipe(take(1)).subscribe(() => {
      galleryRef.reset();
    });
  }

  newItem() {
    console.log('newItem');
    this.galleryComponent.addImage({
      thumb:
        '/storage/styles/portfolio/5be110673230610020000146/9d99ce89bd08fdd32e52ee450add607b_128x128_90_1541476319_thumbnail_adb115059e28d960fa8badfac5516667.jpg?cimgt=1541476877',
      src:
        '/storage/styles/portfolio/5be110673230610020000146/4fb1d7e9fb871235d438bb43dc32e451_1000x667_70_1541476319_fitToWidth_adb115059e28d960fa8badfac5516667.jpg?cimgt=1541476877'
    });
  }

  removeItem() {
    console.log('remove');
    this.galleryComponent.remove(30);
  }
}
