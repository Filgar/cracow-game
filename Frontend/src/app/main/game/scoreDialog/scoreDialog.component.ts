import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GameService } from '../../../services/game.service';
@Component({
  selector: 'app-score',
  standalone: true,
  imports: [],
  templateUrl: './scoreDialog.component.html',
  styleUrl: './scoreDialog.component.scss'
})
export class ScoreDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ScoreDialogComponent>,
    public readonly gameService: GameService
    ){}

  closePopup(): void {
    this.dialogRef.close();
  }
}
