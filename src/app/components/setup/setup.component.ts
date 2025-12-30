import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="setup-screen">
      <div class="setup-card">

        <h2 class="title">⚙️ Configuration des équipes</h2>
        <p class="info">2 à 6 équipes — une équipe = 2 joueurs</p>

        <div class="teams-list">
          <div
            *ngFor="let team of teams; let i = index; trackBy: trackById"
            class="team-row"
          >
            <input
              type="text"
              [(ngModel)]="team.name"
              [placeholder]="'Nom de l’équipe ' + (i + 1)"
              class="input"
            />

            <button
              *ngIf="teams.length > 2"
              class="btn-remove"
              (click)="removeTeam(i)"
            >
              ✕
            </button>
          </div>
        </div>

        <button
          class="btn secondary"
          (click)="addTeam()"
          [disabled]="teams.length >= 6"
        >
          ➕ Ajouter une équipe
        </button>

        <button
          class="btn primary"
          [disabled]="!canStart()"
          (click)="onStart()"
        >
          🚀 Démarrer la partie
        </button>

      </div>
    </div>
  `,
  styles: [`
    /* FOND GLOBAL */
    .setup-screen {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(180deg, #e5e7eb, #c7d2fe);
      padding: 16px;
    }

    /* CARTE */
    .setup-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 24px;
      width: 100%;
      max-width: 420px;

      /* 👇 LISIBILITÉ */
      border: 2px solid #e5e7eb;
      box-shadow:
        0 12px 25px rgba(0,0,0,0.12),
        0 4px 8px rgba(0,0,0,0.06);
    }

    .title {
      text-align: center;
      margin-bottom: 8px;
      color: #111827;
    }

    .info {
      text-align: center;
      color: #374151;
      margin-bottom: 24px;
      font-size: 14px;
    }

    .teams-list {
      margin-bottom: 24px;
    }

    .team-row {
      display: flex;
      gap: 12px;
      margin-bottom: 14px;
    }

    /* INPUTS */
    .input {
      flex: 1;
      padding: 14px;
      font-size: 16px;
      border-radius: 14px;

      /* 👇 CONTRASTE */
      background: #f9fafb;
      border: 2px solid #d1d5db;
      color: #111827;

      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input::placeholder {
      color: #6b7280;
    }

    .input:focus {
      border-color: #4f46e5;
      box-shadow: 0 0 0 2px rgba(79,70,229,0.2);
      outline: none;
      background: #ffffff;
    }

    /* SUPPRESSION */
    .btn-remove {
      width: 46px;
      height: 46px;
      border-radius: 14px;
      border: 2px solid #dc2626;
      background: #ef4444;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }

    /* BOUTONS */
    .btn {
      width: 100%;
      border-radius: 14px;
      border: 2px solid transparent;
      padding: 16px;
      font-size: 16px;
      margin-bottom: 12px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn.primary {
      background: #4f46e5;
      color: white;
      border-color: #4338ca;
      box-shadow: 0 6px 12px rgba(79,70,229,0.3);
    }

    .btn.secondary {
      background: #f3f4f6;
      color: #111827;
      border-color: #d1d5db;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
    }
  `]

})
export class SetupComponent {
  @Output() startGame = new EventEmitter<string[]>();

  teams = [
    { id: 1, name: '' },
    { id: 2, name: '' }
  ];

  private nextId = 3;

  trackById(index: number, team: any) {
    return team.id;
  }

  addTeam() {
    if (this.teams.length < 6) {
      this.teams.push({ id: this.nextId++, name: '' });
    }
  }

  removeTeam(index: number) {
    if (this.teams.length > 2) {
      this.teams.splice(index, 1);
    }
  }

  canStart(): boolean {
    return this.teams.filter(t => t.name.trim().length > 0).length >= 2;
  }

  onStart() {
    if (this.canStart()) {
      const validTeams = this.teams
        .filter(t => t.name.trim().length > 0)
        .map((t, i) => t.name.trim() || `Équipe ${i + 1}`);

      this.startGame.emit(validTeams);
    }
  }
}
