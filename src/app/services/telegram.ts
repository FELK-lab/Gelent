import { Injectable } from '@angular/core';

interface TgUser {
    id: number;
    first_name: string;
    last_name: string;
    username?: string;
    language_code: string;
    photo_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Telegram {
    private tg: any;
    user?: TgUser;

    constructor() {
        if (typeof window !== 'undefined') {
            this.tg = (window as any).Telegram.WebApp;
            if (this.tg) {
                this.tg.ready();
                if (this.tg.initDataUnsafe) {
                    this.user = this.tg.initDataUnsafe.user;
                }
            }
        }
    }
}
