import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { UrbanObject } from '../models/UrbanObject';
import { BehaviorSubject, Observable, Subject, of, takeUntil } from 'rxjs';

const MAX_SCORE_PER_OBJECT = 1000;

@Injectable({
    providedIn: 'root'
})
export class GameService {
    public objectsQueue!: Array<UrbanObject>;
    public score: number = 0;
    public maxScore!: number;
    public objectsCount!: number;
    public isPlaying$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public pointSelected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public selectionConfirmed$: Subject<UrbanObject> = new Subject<UrbanObject>();
    public score$: Subject<number> = new Subject<number>();
    public clearMap$: Subject<void> = new Subject<void>();

    constructor() { }

    startGame(data: Array<UrbanObject>): void {
        this.objectsQueue = data;
        this.objectsCount = data.length;
        this.maxScore = MAX_SCORE_PER_OBJECT * data.length;
        this.score = 0;
        this.isPlaying$.next(true);
    }

    getGameObject(): UrbanObject | null {
        return this.objectsQueue.pop() ?? null;
    }

    calculateScore(distance: number): void {
        if (distance < 1) {
            this.score$.next(MAX_SCORE_PER_OBJECT);
            this.score += MAX_SCORE_PER_OBJECT;
            return;
        }
        if (distance > 1500) {
            this.score$.next(0);
            return;
        }
        const score = (Math.max(MAX_SCORE_PER_OBJECT - distance, 0) * 0.88) +
        (MAX_SCORE_PER_OBJECT / Math.max(distance, 1) ** (1/3)) * 0.12;

        this.score += Math.round(score);
        this.score$.next(Math.round(score));
    }

    get maxScorePerObject(): number {
        return MAX_SCORE_PER_OBJECT;
    }
}

