import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { SetupComponent } from './components/setup/setup.component';
import { GameComponent } from './components/game/game.component';
import { EndComponent } from './components/end/end.component';
import { GameService } from './services/game.service';

type Screen = 'home' | 'setup' | 'game' | 'end';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HomeComponent,
    SetupComponent,
    GameComponent,
    EndComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  currentScreen: Screen = 'home';

  constructor(private gameService: GameService) {}

  goToSetup() {
    this.currentScreen = 'setup';
  }

  startGame(teamNames: string[]) {
    this.gameService.setupGame(teamNames);
    this.currentScreen = 'game';
  }

  goToEnd() {
    this.currentScreen = 'end';
  }

  goToHome() {
    this.gameService.resetGame();
    this.currentScreen = 'home';
  }
}
