import { Injectable, signal } from '@angular/core';
import debounce from 'lodash.debounce';

@Injectable({
  providedIn: 'root'
})
export class PlayerStateService {
  // Используем signal для автоматического обновления в компонентах
  public gold = signal(5000); 

  // В будущем эта функция будет отправлять данные на сервер
  private saveGoldToBackend(newGold: number) {
    console.log(`Debounced: Saving gold ${newGold} to backend...`);
    // Здесь будет вызов API, например:
    // this.http.post('/api/user/gold', { gold: newGold }).subscribe();
  }

  // Создаем debounced-версию функции сохранения с задержкой в 1 секунду
  private debouncedSave = debounce((newGold: number) => this.saveGoldToBackend(newGold), 1000);

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