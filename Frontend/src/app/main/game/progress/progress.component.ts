import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GameService } from '../../../services/game.service';
import { CircleProgressOptions, NgCircleProgressModule } from 'ng-circle-progress';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const ANIMATION_TIMER = 2000;

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, NgCircleProgressModule, MatProgressBarModule],
  providers: [CircleProgressOptions, {
    provide: NgCircleProgressModule,
    useClass: CircleProgressOptions
  }],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.scss'
})
export class ProgressComponent implements OnInit{
  private completed: number = 0;
  
  @ViewChild('scoreContainer') scoreContainer!: ElementRef;

  constructor(
    private readonly gameService: GameService,
    private readonly element: ElementRef) {
      this.gameService.score$.pipe(takeUntilDestroyed()).subscribe((score) => {
        this.completed++;
        this.setScoreBarColor();
        this.showScoreText(score);
      });
    }
  ngOnInit(): void {
    this.element.nativeElement.style.setProperty('--score-color', 'black');
  }

  private setScoreBarColor(): void {
    const percentage = this.scoreProgressValue / this.scoreProgressMaxValue;
    let color: string;
    switch (true) {
      case percentage < 0.2: color = 'linear-gradient(#b22222, #d44444)'; break;
      case percentage < 0.4: color = 'linear-gradient(#ffa500, #ffc722)'; break;
      case percentage < 0.6: color = 'linear-gradient(#ffd700, #fff922)'; break;
      case percentage < 0.8: color = 'linear-gradient(#32cd32, #54ff54)'; break;
      default: color = 'linear-gradient(#228b22, #44ad44)';
    }

    this.element.nativeElement.style.setProperty('--progress-color', color);
  }

  private setScoreFontColor(score: number): string {
    const percentage = (score / this.gameService.maxScorePerObject) ;
    switch (true) {
      case percentage < 0.2: return '#b22222';
      case percentage < 0.4: return '#ffa500';
      case percentage < 0.6: return '#ffd700';
      case percentage < 0.8: return '#32cd32';
      default: return '#228b22';
    }
  }

  private showScoreText(score: number): void {
    const element = this.createScoreElement(score);
    this.scoreContainer.nativeElement.appendChild(element);
    
    setTimeout(() => {
      element.classList.add('score-added');
      this.setScoreProperties();
    }, 100);

    setTimeout(() => {
      this.scoreContainer.nativeElement.removeChild(element);
    }, ANIMATION_TIMER);
  }

  private createScoreElement(score: number): Element {
    const element = document.createElement('div');
    element.innerText = `+${score}`;
    element.id = 'score-added';
    this.element.nativeElement.style.setProperty('--score-color', this.setScoreFontColor(score));
    return element;
  }

  private setScoreProperties(): void {
    this.element.nativeElement.style.setProperty('--score-transform', 'translateY(-3rem)');
    this.element.nativeElement.style.setProperty('--score-opacity', 0);
  }

  get progressText(): string {
    return `${this.completed} / ${this.gameService.objectsCount}`;
  }

  get progressValue(): number {
    return this.completed / this.gameService.objectsCount * 100;
  }

  get scoreText(): string {
    return `${this.gameService.score} / ${this.completed * this.gameService.maxScorePerObject}`;
  }

  get scoreProgressValue(): number {
    return this.gameService.score / (this.gameService.objectsCount * this.gameService.maxScorePerObject) * 100;
  }

  get scoreProgressMaxValue(): number {
    return this.completed * this.gameService.maxScorePerObject 
      / (this.gameService.objectsCount * this.gameService.maxScorePerObject) * 100;
  }

  get radius(): number {
    return window.innerWidth <= 1536 ? 100 : 160;
  }

  get fontSize(): string {
    return window.innerWidth <= 1536 ? '32px' : '48px';
  }

  get barWidth(): number {
    return window.innerWidth <= 1536 ? 16 : 32;
  }
}
