import { Component, inject } from '@angular/core';
import { Telegram } from '../../services/telegram';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  telegram = inject(Telegram);
  showSettings = false;

  constructor() {
    // Данные пользователя теперь доступны через this.telegram.user
    // Например, this.telegram.user?.first_name
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }
}
