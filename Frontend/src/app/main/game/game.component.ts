import { Component } from '@angular/core';
import { SetupComponent } from "./setup/setup.component";
import { MapComponent } from "./map/map.component";
import { GameService } from '../../services/game.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UrbanObject } from '../../models/UrbanObject';
import { CommonModule } from '@angular/common';
import { ProgressComponent } from "./progress/progress.component";
import { MatDialog } from '@angular/material/dialog';
import { ScoreDialogComponent } from './scoreDialog/scoreDialog.component';
import { StorageConsts } from '../../models/StorageConsts';


@Component({
    selector: 'app-game',
    standalone: true,
    templateUrl: './game.component.html',
    styleUrl: './game.component.scss',
    imports: [SetupComponent, MapComponent, CommonModule, ProgressComponent]
})
export class GameComponent {
    public currentObject: UrbanObject | null = null;
    public scoreView: boolean = false;

    constructor(
        public readonly gameService: GameService,
        public readonly dialog: MatDialog
    ) {
        gameService.isPlaying$.pipe(takeUntilDestroyed()).subscribe((isPlaying) => {
            this.currentObject = isPlaying ? this.gameService.getGameObject() : null;
        });

        gameService.score$.pipe(takeUntilDestroyed()).subscribe(() => {
            this.scoreView = true;
        });
    }

    
  getTypeName(type: string): string {
    switch(type) {
      case 'pa': return 'Bus stops';
      case 'pt': return 'Tram stops';
      case 'pta': return 'Bus terminals';
      case 'ul': return 'Streets';
    }
    return type;
  };

  confirmSelection(): void {
    const storedIds = localStorage.getItem(StorageConsts.forbiddenIds);
    const forbiddenIds = storedIds ? JSON.parse(storedIds) : [];

    if(forbiddenIds.length === 100) {
      forbiddenIds.splice(0, 1);
    }

    forbiddenIds.push(this.currentObject?.id);
    localStorage.setItem(StorageConsts.forbiddenIds, JSON.stringify(forbiddenIds));
    this.gameService.selectionConfirmed$.next(this.currentObject!);
  }

  nextObject(): void {
    this.scoreView = false;

    if(this.gameService.objectsQueue.length == 0) {
      this.gameService.isPlaying$.next(false);
      this.showSummary();
    }
    else {
      this.currentObject = this.gameService.getGameObject();
    }

    this.gameService.clearMap$.next();
  }

  private showSummary(): void {
    const dialogRef = this.dialog.open(ScoreDialogComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.gameService.isPlaying$.next(false);
    });
  }
}
