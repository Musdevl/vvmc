import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="screen">

      <!-- HEADER -->
      <header class="header">
        <div class="round">
          Round {{ gameService.gameState.currentRound }} / {{ gameService.MAX_ROUNDS }}
        </div>
        <div class="team">
          🏆 {{ currentTeam?.name }}
        </div>
      </header>

      <main class="content">

        <!-- PHASE ESTIMATION -->
        <section *ngIf="gameService.gameState.phase === 'estimation'" class="card">
          <h2 class="title">🎯 Estimation</h2>

          <div class="theme-box">
            <span>Thème</span>
            <strong>{{ gameService.gameState.currentTheme }}</strong>
          </div>

          <p class="instruction">
            Estime le niveau de ton pote
          </p>

          <div class="levels">
            <button
              *ngFor="let level of levels"
              class="level"
              [class.active]="selectedLevel === level"
              (click)="selectLevel(level)">
              {{ level }}
            </button>
          </div>

          <button
            class="btn primary"
            [disabled]="selectedLevel === null"
            (click)="submitEstimation()">
            Valider le niveau {{ selectedLevel }}
          </button>
        </section>

        <!-- PHASE PASS -->
        <section *ngIf="gameService.gameState.phase === 'pass'" class="card pass">
          <h2 class="title">📱 Passe le téléphone</h2>

          <p><br>Place à la question<br></p>
          <p class="warning"><br>⚠️ Ne regarde pas l'écran avant !</p>

          <button class="btn primary" (click)="readyForQuestion()">
            Je suis prêt
          </button>
        </section>

        <!-- PHASE QUESTION -->
        <section *ngIf="gameService.gameState.phase === 'question'" class="card">
          <h2 class="title">
            ❓ Question — Niveau {{ gameService.gameState.currentEstimation }}
          </h2>

          <div class="question-box">
            {{ gameService.gameState.currentQuestion?.question }}
          </div>

          <button
            *ngIf="!answerRevealed"
            class="btn primary"
            (click)="revealAnswer()">
            👀 Voir la réponse
          </button>

          <div *ngIf="answerRevealed" class="answer-zone">
            <div class="answer-box">
              {{ gameService.gameState.currentQuestion?.answer }}
            </div>

            <div class="decision">
              <button class="btn success" (click)="validateAnswer(true)">✔ Juste</button>
              <button class="btn danger" (click)="validateAnswer(false)">✖ Faux</button>
            </div>
          </div>
        </section>

        <!-- PHASE RESULT -->
        <section *ngIf="gameService.gameState.phase === 'result'" class="card result"
                 [class.good]="isCorrect"
                 [class.bad]="!isCorrect">

          <h2 class="title">
            {{ isCorrect ? '🎉 Bonne réponse !' : '😬 Mauvaise réponse' }}
          </h2>

          <div class="answer-box">
            {{ gameService.gameState.currentQuestion?.answer }}
          </div>

          <div *ngIf="isCorrect" class="points">
            +{{ gameService.gameState.currentEstimation }} points
          </div>

          <div class="scores">
            <div *ngFor="let team of gameService.teams" class="score">
              <span>{{ team.name }}</span>
              <strong>{{ team.score }} pts</strong>
            </div>
          </div>

          <button class="btn primary" (click)="nextTurn()">
            {{ isGameOver() ? '🏁 Résultats' : '➡ Tour suivant' }}
          </button>
        </section>

      </main>
    </div>
  `,

  styles: [`
    .screen {
      min-height: 100vh;
      background: linear-gradient(180deg, #f9fafb, #eef2ff);
      font-family: system-ui, sans-serif;
    }

    .header {
      padding: 16px;
      text-align: center;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .round {
      font-size: 14px;
      color: #6b7280;
    }

    .team {
      font-size: 20px;
      font-weight: bold;
      margin-top: 4px;
    }

    .content {
      padding: 16px;
      display: flex;
      justify-content: center;
    }

    .card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      text-align: center;
    }

    .title {
      margin-bottom: 16px;
    }

    .theme-box {
      background: #eef2ff;
      padding: 12px;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    .instruction {
      margin-bottom: 16px;
    }

    .levels {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }

    .level {
      padding: 14px;
      font-size: 18px;
      border-radius: 10px;
      border: 2px solid #e5e7eb;
      background: #b4b4b4;
    }

    .level.active {
      background: #6366f1;
      color: white;
      border-color: #6366f1;
    }

    .btn {
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      font-size: 16px;
      border: none;
      margin-top: 12px;
    }

    .btn.primary {
      background: #6366f1;
      color: white;
    }

    .btn.success {
      background: #10b981;
      color: white;
    }

    .btn.danger {
      background: #ef4444;
      color: white;
    }

    .question-box,
    .answer-box {
      background: #f3f4f6;
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 16px;
    }

    .decision {
      display: flex;
      gap: 12px;
    }

    .decision .btn {
      width: 50%;
    }

    .pass .player-highlight {
      font-size: 24px;
      font-weight: bold;
      margin: 12px 0;
    }

    .warning {
      color: #dc2626;
      font-weight: bold;
    }

    .result.good {
      border: 3px solid #10b981;
    }

    .result.bad {
      border: 3px solid #ef4444;
    }

    .points {
      font-size: 22px;
      font-weight: bold;
      color: #10b981;
      margin-bottom: 12px;
    }

    .scores {
      margin: 16px 0;
    }

    .score {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
    }
  `]
})

export class GameComponent implements OnInit {
  @Output() gameEnd = new EventEmitter<void>();

  levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedLevel: number | null = null;
  isCorrect = false;
  answerRevealed = false;

  constructor(public gameService: GameService) {}

  ngOnInit() {
    this.gameService.startTurn();
  }

  get currentTeam() {
    return this.gameService.getCurrentTeam();
  }

  selectLevel(level: number) {
    this.selectedLevel = level;
  }

  submitEstimation() {
    if (this.selectedLevel !== null) {
      this.gameService.submitEstimation(this.selectedLevel);
    }
  }

  readyForQuestion() {
    this.gameService.readyForQuestion();
  }

  // Nouvelle méthode pour révéler la réponse
  revealAnswer() {
    this.answerRevealed = true;
  }

  // Nouvelle méthode pour valider la réponse
  validateAnswer(isAnswerCorrect: boolean) {
    this.isCorrect = this.gameService.submitAnswer(isAnswerCorrect);
  }

  nextTurn() {
    if (this.isGameOver()) {
      this.gameEnd.emit();
    } else {
      this.selectedLevel = null;
      this.answerRevealed = false;
      this.gameService.nextTurn();
      this.gameService.startTurn();
    }
  }

  isGameOver(): boolean {
    return this.gameService.isGameOver();
  }
}

