import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { PlayerStateService } from '../../services/player-state.service';
import { Subject, Subscription, of } from 'rxjs';
import { exhaustMap, tap, delay } from 'rxjs/operators';

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
  isAlive: boolean;
  image: string;
}

@Component({
  selector: 'app-farm',
  templateUrl: './farm.html',
  styleUrls: ['./farm.css']
})
export class Farm implements OnInit, OnDestroy {
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
  
  private attackRequest = new Subject<void>();
  private subscription!: Subscription;
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

    this.subscription = this.attackRequest.pipe(
      exhaustMap(() => {
        const target = this.findNearestEnemy();
        if (!target) return of(null);
        
        return of(target).pipe(
          tap(() => { this.isAttacking = true; }),
          tap(t => { this.player.x = t.x; this.player.y = t.y; }),
          delay(500),
          tap(t => {
            t.isAlive = false;
            this.playerState.addGold(15);
            this.player.xp += 2;

            // Проверяем уровень
            if (this.player.xp >= this.player.xpToNextLevel) {
              this.player.level++;
              this.player.xp = 0;
              this.player.xpToNextLevel = Math.floor(this.player.xpToNextLevel * 1.5);
            }
          }),
          delay(500),
          tap(() => { this.player.x = 150; this.player.y = 200; }),
          delay(500),
          tap(() => { 
            this.spawnEnemy();
            this.isAttacking = false;
          })
        );
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  spawnEnemy() {
    // Выбираем случайный тип врага
    const randomImage = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];

    const newEnemy: Enemy = {
      id: this.enemyIdCounter++,
      x: Math.random() * 280 + 10, // Случайная позиция по X
      y: Math.random() * 150 + 20, // Случайная позиция по Y
      isAlive: true,
      image: randomImage,
    };
    this.enemies.push(newEnemy);
  }

  findNearestEnemy(): Enemy | null {
    const livingEnemies = this.enemies.filter(e => e.isAlive);
    if (livingEnemies.length === 0) return null;

    return livingEnemies.reduce((nearest, enemy) => {
      const distToEnemy = Math.hypot(this.player.x - enemy.x, this.player.y - enemy.y);
      const distToNearest = Math.hypot(this.player.x - nearest.x, this.player.y - nearest.y);
      return distToEnemy < distToNearest ? enemy : nearest;
    });
  }

  attack() {
    this.attackRequest.next();
  }
}
