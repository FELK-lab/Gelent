import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlayerStateService {
  // Используем signal для автоматического обновления в компонентах
  public gold = signal(5000); 

  // Метод для добавления золота
  addGold(amount: number) {
    this.gold.update(currentGold => currentGold + amount);
  }

  // Геттер для форматированного отображения золота
  get formattedGold(): string {
    const goldValue = this.gold();
    if (goldValue >= 10000) {
      return (goldValue / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return goldValue.toString();
  }
} 