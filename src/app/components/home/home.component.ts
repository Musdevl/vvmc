import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="home-screen">
      <div class="home-content">

        <div class="logo">🎯</div>

        <h1 class="title">
          Vous vous mettez<br />
          combien ?
        </h1>

        <p class="description">
          Estimez le niveau de connaissance<br />
          de votre coéquipier et marquez des points !
        </p>

        <button class="btn primary big" (click)="onStart()">
          ▶ Nouvelle partie
        </button>

        <p class="hint">
          👥 2 à 6 équipes • 📱 Un seul téléphone
        </p>

      </div>
    </div>
  `,
  styles: [`
    /* ÉCRAN COMPLET */
    .home-screen {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(180deg, #6366f1, #4338ca);
      color: white;
    }

    /* CONTENU CENTRÉ */
    .home-content {
      text-align: center;
      padding: 24px;
      max-width: 420px;
      width: 100%;
    }

    .logo {
      font-size: 64px;
      margin-bottom: 24px;
    }

    .title {
      font-size: 28px;
      line-height: 1.2;
      margin-bottom: 16px;
    }

    .description {
      font-size: 16px;
      opacity: 0.9;
      margin-bottom: 36px;
    }

    .btn {
      width: 100%;
      border: none;
      border-radius: 14px;
      cursor: pointer;
    }

    .btn.primary {
      background: white;
      color: #4338ca;
      font-weight: bold;
    }

    .btn.big {
      font-size: 18px;
      padding: 18px;
    }

    .btn:active {
      transform: scale(0.98);
    }

    .hint {
      margin-top: 28px;
      font-size: 14px;
      opacity: 0.8;
    }
  `]
})
export class HomeComponent {
  @Output() start = new EventEmitter<void>();

  onStart() {
    this.start.emit();
  }
}
