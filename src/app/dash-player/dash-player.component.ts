import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { formatTime } from '../../tools';

@Component({
  selector: 'app-dash-player',
  standalone: true,
  imports: [ NgIf ],
  templateUrl: './dash-player.component.html',
  styleUrl: './dash-player.component.scss'
})
export class DashPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('videoPlayer', { static: true }) videoPlayer: ElementRef<HTMLVideoElement> | undefined;
  @ViewChild('videoController', { static: false }) videoControler: ElementRef<HTMLVideoElement> | undefined;

  private dashPlayer: any;
  private duration: number | undefined;
  private currentTime: number | undefined;
  progressBarPercent: string | undefined;
  isPaused: boolean;
  currentTimeFormat: string;
  durationFormat: string;
  displayControlPlayer: boolean;

  constructor() {
    this.isPaused = true;
    this.currentTimeFormat = "00:00:00";
    this.durationFormat = "00:00:00";
    this.displayControlPlayer = false;
  }

  async ngOnInit() {
    const dashjs = await import('dashjs');
    if (this.videoPlayer !== undefined) {
      console.log("this.videoPlayer ", document.documentElement.requestFullscreen)
      this.dashPlayer = dashjs.MediaPlayer().create();
      this.dashPlayer.initialize(
        this.videoPlayer.nativeElement,
        'https://s3.amazonaws.com/_bc_dml/example-content/sintel_dash/sintel_vod.mpd',
        true
      );
      this.dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_METADATA_LOADED, () => {
        this.isPaused = false;
        this.duration = this.dashPlayer.duration();
        this.dashPlayer.on(dashjs.MediaPlayer.events.PLAYBACK_TIME_UPDATED, () => {
          this.currentTime = this.dashPlayer.time();
          if (this.currentTime !== undefined && this.duration !== undefined) {
            this.currentTimeFormat = formatTime(Math.floor(this.currentTime));
            this.durationFormat = formatTime(Math.floor(this.duration));
            this.progressBarPercent = `${ (this.currentTime / this.duration) * 100 }%`;
          }
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.dashPlayer) {
      this.dashPlayer.destroy();
    }
  }

  playPause(): void {
    if (this.dashPlayer !== undefined) {
      this.dashPlayer.isPaused() ? this.dashPlayer.play() : this.dashPlayer.pause();
      this.isPaused = this.dashPlayer.isPaused();
    }
  }

  seek(value?: number): void {
    if (this.dashPlayer !== undefined) {
      if (value !== undefined) {
        this.dashPlayer.seek(value);
      } else {
        if (this.duration !== undefined && this.currentTime !== undefined) {
          let valueSeek = this.currentTime + this.duration * 0.05;
          valueSeek = valueSeek > this.duration ? this.duration : valueSeek;
          this.dashPlayer.seek(valueSeek);
        }
      }
    }
  }

  onMouseEnter(): void {
    this.displayControlPlayer = true;
  }

  onMouseLeave(): void {
    this.displayControlPlayer = false;
  }
}
