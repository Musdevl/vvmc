import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-end',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="screen">
      <div class="content">
        <h1 class="title">🎉</h1>
        <h2 class="subtitle">Fin de la partie !</h2>

        <div class="winner-card">
          <div class="winner-label">🏆 Gagnant</div>
          <div class="winner-name">{{ winner?.name }}</div>
          <div class="winner-score">{{ winner?.score }} points</div>
        </div>

        <div class="rankings">
          <h3>Classement final</h3>
          <div
            *ngFor="let team of sortedTeams; let i = index"
            class="rank-item"
            [class.first]="i === 0"
          >
            <span class="rank-position">{{ i + 1 }}</span>
            <span class="rank-name">{{ team.name }}</span>
            <span class="rank-score">{{ team.score }} pts</span>
          </div>
        </div>

        <button class="btn btn-primary" (click)="onReplay()">
          Rejouer
        </button>
      </div>
    </div>
  `,
  styles: [`
    .winner-card {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      padding: 30px;
      border-radius: 16px;
      text-align: center;
      margin: 30px 0;
      box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
    }
    .winner-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 10px;
    }
    .winner-name {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .winner-score {
      font-size: 24px;
      font-weight: bold;
    }
    .rankings {
      background: #f3f4f6;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 30px;
    }
    .rankings h3 {
      margin-bottom: 15px;
      color: #333;
    }
    .rank-item {
      display: flex;
      align-items: center;
      padding: 12px;
      margin-bottom: 8px;
      background: white;
      border-radius: 8px;
      border: 2px solid transparent;
    }
    .rank-item.first {
      border-color: #fbbf24;
      background: #fef3c7;
    }
    .rank-position {
      width: 30px;
      height: 30px;
      background: #667eea;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 15px;
    }
    .rank-item.first .rank-position {
      background: #fbbf24;
    }
    .rank-name {
      flex: 1;
      font-weight: 500;
    }
    .rank-score {
      font-weight: bold;
      color: #667eea;
    }
  `]
})
export class EndComponent {
  @Output() replay = new EventEmitter<void>();

  constructor(public gameService: GameService) {}

  get winner() {
    return this.gameService.getWinner();
  }

  get sortedTeams() {
    return [...this.gameService.teams].sort((a, b) => b.score - a.score);
  }

  onReplay() {
    this.replay.emit();
  }
}
