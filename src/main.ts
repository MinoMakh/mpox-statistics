import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { register as registerSwiperElement } from 'swiper/element';

registerSwiperElement();

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()]
})
.catch(err => console.error(err));