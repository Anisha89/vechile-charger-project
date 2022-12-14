/*
* Bootstrap slider in angular 2
* https://embed.plnkr.co/ScE0uqfd0ZvL6T9j1XjL/
*
*/
import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { SlideComponent } from '../slide/slide.component';

export enum Direction { UNKNOWN, NEXT, PREV }

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, OnDestroy {

    constructor() { }

    ngOnInit() {
    }

    @Input() public noWrap: boolean;
    @Input() public noPause: boolean;
    @Input() public noTransition: boolean;

    @Input() public get interval(): number {
        return this._interval;
    }

    public set interval(value: number) {
        this._interval = value;
        this.restartTimer();
    }

    private slides: Array<SlideComponent> = [];
    private currentInterval: any;
    private isPlaying: boolean;
    private destroyed: boolean = false;
    private currentSlide: SlideComponent;
    private _interval: number;

    public ngOnDestroy() {
        this.destroyed = true;
    }

    public select(nextSlide: SlideComponent, direction: Direction = Direction.UNKNOWN) {
        let nextIndex = nextSlide.index;
        if (direction === Direction.UNKNOWN) {
            direction = nextIndex > this.getCurrentIndex() ? Direction.NEXT : Direction.PREV;
        }

        // Prevent this user-triggered transition from occurring if there is already one in progress
        if (nextSlide && nextSlide !== this.currentSlide) {
            this.goNext(nextSlide, direction);
        }
    }

    private goNext(slide: SlideComponent, direction: Direction) {
        if (this.destroyed) {
            return;
        }

        slide.direction = direction;
        slide.active = true;

        if (this.currentSlide) {
            this.currentSlide.direction = direction;
            this.currentSlide.active = false;
        }

        this.currentSlide = slide;

        // every time you change slides, reset the timer
        this.restartTimer();
    }

    private getSlideByIndex(index: number) {
        let len = this.slides.length;
        for (let i = 0; i < len; ++i) {
            if (this.slides[i].index === index) {
                return this.slides[i];
            }
        }
    }

    private getCurrentIndex() {
        return !this.currentSlide ? 0 : this.currentSlide.index;
    }

    public next() {
        let newIndex = (this.getCurrentIndex() + 1) % this.slides.length;

        if (newIndex === 0 && this.noWrap) {
            this.pause();
            return;
        }

        return this.select(this.getSlideByIndex(newIndex), Direction.NEXT);
    }

    public prev() {
        let newIndex = this.getCurrentIndex() - 1 < 0 ? this.slides.length - 1 : this.getCurrentIndex() - 1;

        if (this.noWrap && newIndex === this.slides.length - 1) {
            this.pause();
            return;
        }

        return this.select(this.getSlideByIndex(newIndex), Direction.PREV);
    }

    private restartTimer() {
        this.resetTimer();
        let interval = +this.interval;
        if (!isNaN(interval) && interval > 0) {
            this.currentInterval = setInterval(() => {
                let nInterval = +this.interval;
                if (this.isPlaying && !isNaN(this.interval) && nInterval > 0 && this.slides.length) {
                    this.next();
                } else {
                    this.pause();
                }
            }, interval);
        }
    }

    private resetTimer() {
        if (this.currentInterval) {
            clearInterval(this.currentInterval);
            this.currentInterval = null;
        }
    }

    public play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.restartTimer();
        }
    }

    public pause() {
        if (!this.noPause) {
            this.isPlaying = false;
            this.resetTimer();
        }
    }

    public addSlide(slide: SlideComponent) {
        slide.index = this.slides.length;
        this.slides.push(slide);
        if (this.slides.length === 1 || slide.active) {
            this.select(this.slides[this.slides.length - 1]);
            if (this.slides.length === 1) {
                this.play();
            }
        } else {
            slide.active = false;
        }
    }

    public removeSlide(slide: SlideComponent) {
        this.slides.splice(slide.index, 1);

        if (this.slides.length === 0) {
            this.currentSlide = null;
            return;
        }

        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].index = i;
        }
    }

}
