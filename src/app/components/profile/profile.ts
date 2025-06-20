import { Component, inject } from '@angular/core';
import { Telegram } from '../../services/telegram';
import { RouterLink } from '@angular/router';
import { PlayerStateService } from '../../services/player-state.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  telegram = inject(Telegram);
  playerState = inject(PlayerStateService);
  showSettings = false;

  constructor() {
    // Данные пользователя теперь доступны через this.telegram.user
    // Золото теперь берется из playerState
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }
}
