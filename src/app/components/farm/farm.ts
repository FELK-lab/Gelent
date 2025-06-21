import { Component, inject } from '@angular/core';
import { PlayerStateService } from '../../services/player-state.service';
import { CommonModule } from '@angular/common';

interface Player {
  level: number;
  xp: number;
  xpToNextLevel: number;
  damage: number; // Сколько золота и опыта за тап
}

interface FloatingText {
  id: number;
  value: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-farm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farm.html',
  styleUrls: ['./farm.css']
})
export class Farm {
  playerState = inject(PlayerStateService);

  player: Player = {
    level: 1,
    xp: 0,
    xpToNextLevel: 15,
    damage: 1,
  };

  floatingTexts: FloatingText[] = [];
  private floatingTextIdCounter = 0;

  get xpPercentage(): number {
    return (this.player.xp / this.player.xpToNextLevel) * 100;
  }

  onTap(event: MouseEvent) {
    // 1. Добавляем золото через сервис
    this.playerState.addGold(this.player.damage);

    // 2. Добавляем опыт и проверяем левел-ап
    this.player.xp += this.player.damage;
    if (this.player.xp >= this.player.xpToNextLevel) {
      this.player.level++;
      this.player.xp = this.player.xp - this.player.xpToNextLevel;
      this.player.xpToNextLevel = Math.floor(this.player.xpToNextLevel * 1.5);
      this.player.damage++; // Увеличиваем урон с уровнем
    }

    // 3. Создаем всплывающий текст
    this.createFloatingText(event);
  }

  private createFloatingText(event: MouseEvent) {
    const text: FloatingText = {
      id: this.floatingTextIdCounter++,
      value: `+${this.player.damage}`,
      x: event.clientX,
      y: event.clientY,
    };
    this.floatingTexts.push(text);

    // Удаляем текст через 1 секунду
    setTimeout(() => {
      this.floatingTexts = this.floatingTexts.filter(t => t.id !== text.id);
    }, 1000);
  }
}
