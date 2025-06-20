import { Component, inject } from '@angular/core';
import { Telegram } from '../../services/telegram';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  telegram = inject(Telegram);

  constructor() {
    // Данные пользователя теперь доступны через this.telegram.user
    // Например, this.telegram.user?.first_name
  }
}
