import { Injectable, signal } from '@angular/core';
import debounce from 'lodash.debounce';

@Injectable({
  providedIn: 'root'
})
export class PlayerStateService {
  private readonly GOLD_STORAGE_KEY = 'playerGold';
  public gold = signal(this.loadGold()); 

  constructor() {
    // Начальное значение уже установлено через loadGold()
  }

  private loadGold(): number {
    if (typeof window !== 'undefined') {
      const savedGold = window.localStorage.getItem(this.GOLD_STORAGE_KEY);
      return savedGold ? parseInt(savedGold, 10) : 5000;
    }
    return 5000;
  }

  private saveGold(newGold: number) {
    if (typeof window !== 'undefined') {
      console.log(`Saving gold ${newGold} to localStorage...`);
      window.localStorage.setItem(this.GOLD_STORAGE_KEY, newGold.toString());
    }
  }

  private debouncedSave = debounce((newGold: number) => this.saveGold(newGold), 1000);

  // Метод для добавления золота
  addGold(amount: number) {
    this.gold.update(currentGold => {
      const newGold = currentGold + amount;
      // Вызываем debounced-функцию для сохранения
      this.debouncedSave(newGold);
      return newGold;
    });
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