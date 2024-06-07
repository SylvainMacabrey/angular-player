import { Routes } from '@angular/router';
import { ShakaPlayerComponent } from './shaka-player/shaka-player.component';
import { DashPlayerComponent } from './dash-player/dash-player.component';
import { VideoJsComponent } from './video-js/video-js.component';

export const routes: Routes = [
  { path: '', component: DashPlayerComponent },
  { path: 'shaka', component: ShakaPlayerComponent },
  { path: 'videojs', component: VideoJsComponent }
];
