import { Component, OnInit, inject } from '@angular/core';
import { PlayerStateService } from '../../services/player-state.service';

// Определяем типы для удобства
interface Character {
  x: number;
  y: number;
}

interface Player extends Character {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

interface Enemy extends Character {
  id: number;
  hp: number;
  isAlive: boolean;
  image: string;
}

@Component({
  selector: 'app-farm',
  templateUrl: './farm.html',
  styleUrls: ['./farm.css']
})
export class Farm implements OnInit {
  playerState = inject(PlayerStateService);

  player: Player = {
    x: 150,
    y: 200,
    level: 1,
    xp: 0,
    xpToNextLevel: 15
  };

  enemies: Enemy[] = [];
  isAttacking = false;
  private enemyIdCounter = 0;
  private enemyTypes = [
    '/assets/images/ORK.jpg',
    '/assets/images/Kras.jpg'
  ];

  ngOnInit() {
    // Создаем начальных врагов
    for (let i = 0; i < 3; i++) {
      this.spawnEnemy();
    }
  }

  spawnEnemy() {
    // Выбираем случайный тип врага
    const randomImage = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];

    const newEnemy: Enemy = {
      id: this.enemyIdCounter++,
      x: Math.random() * 280 + 10, // Случайная позиция по X
      y: Math.random() * 150 + 20, // Случайная позиция по Y
      hp: 3, // Враг умирает за 3 удара
      isAlive: true,
      image: randomImage,
    };
    this.enemies.push(newEnemy);
  }

  findNearestEnemy(): Enemy | null {
    const livingEnemies = this.enemies.filter(e => e.isAlive);
    if (livingEnemies.length === 0) return null;

    let nearestEnemy: Enemy | null = null;
    let minDistance = Infinity;

    for (const enemy of livingEnemies) {
      const distance = Math.sqrt(Math.pow(this.player.x - enemy.x, 2) + Math.pow(this.player.y - enemy.y, 2));
      if (distance < minDistance) {
        minDistance = distance;
        nearestEnemy = enemy;
      }
    }
    return nearestEnemy;
  }

  async attack() {
    if (this.isAttacking) return;

    const target = this.findNearestEnemy();
    if (!target) return;

    this.isAttacking = true;

    try {
      // 1. Перемещение к врагу
      this.player.x = target.x;
      this.player.y = target.y;
      await new Promise(resolve => setTimeout(resolve, 500)); // Анимация перемещения

      // 2. Мгновенное убийство и получение наград
      target.isAlive = false;
      this.playerState.addGold(15);
      this.player.xp += 2;

      // 3. Проверка на повышение уровня
      if (this.player.xp >= this.player.xpToNextLevel) {
        this.player.level++;
        this.player.xp -= this.player.xpToNextLevel;
        this.player.xpToNextLevel = Math.floor(this.player.xpToNextLevel * 1.5);
      }
      
      // 4. Респаун нового врага
      setTimeout(() => this.spawnEnemy(), 1000);

    } finally {
      // 5. Возвращение на базу и сброс состояния
      setTimeout(() => {
        this.player.x = 150;
        this.player.y = 200;
        this.isAttacking = false;
      }, 1500);
    }
  }
}
