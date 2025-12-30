import { Injectable } from '@angular/core';
import { QUESTIONS, Question } from '../model/questions';  // ⚠️ CHANGÉ: model au lieu de models

export interface Team {
  name: string;
  player1: string;
  player2: string;
  score: number;
}

export interface GameState {
  currentRound: number;
  currentTeamIndex: number;
  currentEstimation: number | null;
  currentQuestion: Question | null;
  currentTheme: string | null;
  phase: 'estimation' | 'pass' | 'question' | 'result';
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  teams: Team[] = [];
  gameState: GameState = {
    currentRound: 1,
    currentTeamIndex: 0,
    currentEstimation: null,
    currentQuestion: null,
    currentTheme: null,
    phase: 'estimation'
  };

  readonly MAX_ROUNDS = 10;

  private allThemes: string[] = [];
  private availableThemes: string[] = [];


  constructor() {
    this.initThemes();
  }

  initThemes() {
    const themesSet = new Set(
      QUESTIONS.map(q => q.theme.trim())
    );
    this.allThemes = Array.from(themesSet);
  }

  private shuffleArray<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }


  setupGame(teamNames: string[]) {
    this.teams = teamNames.map(name => ({
      name,
      player1: 'Joueur 1',
      player2: 'Joueur 2',
      score: 0
    }));
    this.resetGame();
  }

  resetGame() {
    this.gameState = {
      currentRound: 1,
      currentTeamIndex: 0,
      currentEstimation: null,
      currentQuestion: null,
      currentTheme: null,
      phase: 'estimation'
    };

    this.teams.forEach(t => t.score = 0);

    // 🔥 IMPORTANT : tous les thèmes redeviennent disponibles
    this.availableThemes = this.shuffleArray([...this.allThemes]);
  }


  getCurrentTeam(): Team {
    return this.teams[this.gameState.currentTeamIndex];
  }

  startTurn() {
    if (this.availableThemes.length === 0) {
      // sécurité : au cas où la partie dépasse le nombre de thèmes
      this.availableThemes = this.shuffleArray([...this.allThemes]);
    }

    this.gameState.currentTheme = this.availableThemes.pop()!;
    this.gameState.phase = 'estimation';
  }

  submitEstimation(level: number) {
    this.gameState.currentEstimation = level;
    this.gameState.phase = 'pass';
  }

  readyForQuestion() {
    if (this.gameState.currentEstimation && this.gameState.currentTheme) {
      const possibleQuestions = QUESTIONS.filter(
        q => q.theme === this.gameState.currentTheme && q.level === this.gameState.currentEstimation
      );

      if (possibleQuestions.length > 0) {
        this.gameState.currentQuestion = possibleQuestions[Math.floor(Math.random() * possibleQuestions.length)];
        this.gameState.phase = 'question';
      }
    }
  }

  submitAnswer(isCorrect: boolean): boolean {
    if (!this.gameState.currentQuestion) return false;

    if (isCorrect && this.gameState.currentEstimation) {
      this.teams[this.gameState.currentTeamIndex].score += this.gameState.currentEstimation;
    }

    this.gameState.phase = 'result';
    return isCorrect;
  }

  nextTurn() {
    this.gameState.currentTeamIndex++;

    if (this.gameState.currentTeamIndex >= this.teams.length) {
      this.gameState.currentTeamIndex = 0;
      this.gameState.currentRound++;
    }

    this.gameState.currentEstimation = null;
    this.gameState.currentQuestion = null;
    this.gameState.currentTheme = null;
    this.gameState.phase = 'estimation';
  }

  isGameOver(): boolean {
    return this.gameState.currentRound > this.MAX_ROUNDS;
  }

  getWinner(): Team {
    return this.teams.reduce((prev, current) =>
      (prev.score > current.score) ? prev : current
    );
  }
}
