import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'app-video-js',
  standalone: true,
  imports: [],
  templateUrl: './video-js.component.html',
  styleUrl: './video-js.component.scss'
})
export class VideoJsComponent implements OnInit, OnDestroy {
  @ViewChild('target', {static: true}) target: ElementRef | undefined;

  private _options: any;

  private _player: Player | undefined;

  constructor(
    private elementRef: ElementRef,
  ) {
    this._options = {
      aspectRatio: '16:9',
      autoplay: true,
      sources: [
        {
          src: 'https://s3.amazonaws.com/_bc_dml/example-content/sintel_dash/sintel_vod.mpd',
          type: 'application/dash+xml',
        }
      ],
  }
  }

  ngOnInit() {
    this._player = videojs(this.target?.nativeElement, this._options, () => {
      console.log('onPlayerReady', this._player);
    });
  }

  ngOnDestroy() {
    if (this._player !== undefined) {
      this._player.dispose();
    }
  }
}
