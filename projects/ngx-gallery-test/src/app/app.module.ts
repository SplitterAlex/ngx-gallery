import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GalleryModule } from '@ngx-gallery/core';
import { NgCockpitModule } from 'ng-cockpit';
import { MapperClass } from './mapper.class';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GalleryModule,
    LightboxModule,
    NgCockpitModule.forRoot(
      {
        token: 'aded2423c572f012ebeb359edc9d72',
        retryBackoffSettings: {
          initialInterval: 200,
          maxRetries: 1
        }
      },
      MapperClass
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
